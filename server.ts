import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini on server
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_INSTRUCTION = `Eres Arfi, el Asistente y Coach de Inteligencia Comercial de nuestra empresa tecnológica.
Tu propósito es asesorar, guiar y optimizar el trabajo del equipo de ventas y los operadores de Miniapp y pasarelas de pago.
Conocimiento clave de la empresa:
- Moneda de referencia:
  - Todas las cifras monetarias están expresadas en pesos ($).
- Productos principales:
  1. Miniapp Starter ($180, mantenimiento $15/mes): Aplicación web progresiva ultrarrápida para negocios locales, catálogos digitales interactivos y recepción de pedidos por WhatsApp.
  2. Miniapp Pro E-Commerce ($350, mantenimiento $25/mes): Tienda digital con panel de control de inventario, pasarela de pago integrada y analíticas.
  3. Arfa Pagos & Cobranzas ($220, mantenimiento $20/mes): Sistema centralizado de cobros con links de pago, suscripciones recurrentes y notificaciones automáticas de comprobantes.
  4. TurnosYa Suite ($280, mantenimiento $20/mes): Gestión inteligente de turnos, recordatorios automáticos por WhatsApp y calendario sincronizado para estéticas, barberías, consultorios.
  5. Gestión Resto & QR ($320, mantenimiento $25/mes): Menú QR para mesas, comandas digitales e integración de facturación.
  6. Web Corporativa & SEO 360 ($450, mantenimiento $30/mes): Presencia web institucional premium con optimización para Google.
- Esquema de Comisiones:
  - 15% de comisión directa por cada venta cerrada al contado.
  - Bono de $100 al alcanzar 5 ventas en el mes.
  - Bono adicional del 5% del valor anual si el cliente contrata el mantenimiento anual por adelantado (con 2 meses de descuento).
- Políticas de Mantenimiento:
  - El mantenimiento cubre hosting de alta velocidad en la nube, soporte técnico prioritario, actualizaciones de seguridad y copias de respaldo semanales.
  - Vencimiento el día 10 de cada mes.
  - Si no paga: Día 11 a 15 se envía aviso preventivo; Día 16 recordatorio con recargo; Día 20 suspensión temporal de la aplicación hasta regularizar.
- Tono y Estilo:
  - Profesional, motivador, práctico y orientado a resultados.
  - Da respuestas concisas, con viñetas claras y scripts listos para copiar y pegar en WhatsApp cuando el vendedor lo requiera.
  - Siempre habla en español rioplatense o neutro comercial cálido.`;

// API routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/arfi/chat', async (req, res) => {
  const { message, context, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'El mensaje es requerido' });
  }

  // If Gemini API is available, query gemini-3.8-flash
  if (aiClient) {
    try {
      let prompt = `Mensaje del vendedor: "${message}"\n`;
      if (context) {
        prompt += `\nContexto actual del vendedor:\n`;
        prompt += `- Vendedor: ${context.sellerName || 'Vendedor'}\n`;
        prompt += `- Rol: ${context.sellerRole || 'Comercial'}\n`;
        prompt += `- Ventas del mes: ${context.salesCount || 0} (${context.totalVolume || '$0'})\n`;
        if (context.overdueCount) {
          prompt += `- Clientes con mantenimiento vencido a su cargo: ${context.overdueCount}\n`;
        }
      }

      const generatePromise = aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 7000)
      );

      const response: any = await Promise.race([generatePromise, timeoutPromise]);
      if (response && response.text) {
        return res.json({ reply: response.text, source: 'gemini' });
      }
    } catch (err: any) {
      console.error('Gemini API call skipped or timed out, using fallback:', err?.message || err);
    }
  }

  // High quality context-aware fallback engine
  const lower = message.toLowerCase();
  let fallbackReply = '';

  if (lower.includes('objecion') || lower.includes('caro') || lower.includes('precio') || lower.includes('cuesta')) {
    fallbackReply = `💡 **Cómo rebatir la objeción de precio ("Me parece caro"):**

1. **Aísla el valor del retorno:**
   > *"Entiendo perfectamente tu punto, [Nombre]. Déjame preguntarte: ¿cuántos clientes o ventas adicionales necesitas por mes para que esta Miniapp se pague sola? Generalmente con solo 2 o 3 pedidos recuperas la inversión total."*

2. **Compara con el costo de no tenerla:**
   > *"Hoy estás perdiendo pedidos por responder tarde en WhatsApp o no tener un catálogo accesible 24/7. Esta herramienta trabaja para vos sin descanso por menos de lo que cuesta un café al día."*

3. **Opción de cierre:**
   > *"Podemos comenzar con la versión Miniapp Starter en 2 cuotas, y cuando veas el flujo de ventas pasamos a la versión Pro. ¿Te parece bien que te reserve el cupo de activación hoy?"*`;
  } else if (lower.includes('mantenimiento') || lower.includes('mora') || lower.includes('vencid') || lower.includes('cobrar')) {
    fallbackReply = `🚨 **Script sugerido para reclamo de mantenimiento preventivo:**

> *"¡Hola [Nombre]! Te escribo de la administración de Arfa / Miniapp. Esperamos que tu app esté rindiendo al 100%. Te recordamos que la cuota de mantenimiento y servidor seguro del mes venció el día 10 ($[Monto]). Para mantener el hosting optimizado y evitar interrupciones automáticas en el servicio, podés regularizarlo con este link de pago: [Link]. ¡Avisame cualquier duda!"*

📌 **Tip de Arfi:** Ofrecer 2 meses gratis si abonan el año completo reduce la morosidad en un 80%.`;
  } else if (lower.includes('miniapp') || lower.includes('que es') || lower.includes('caracteristica')) {
    fallbackReply = `📱 **Miniapp en 30 segundos (Pitch de venta):**

- **¿Qué es?:** Es una aplicación ultrarrápida que no requiere descarga pesada de App Store o Play Store. Abre al instante desde un link o código QR.
- **Ventaja para el cliente:** Carga en menos de 1 segundo, no gasta memoria del teléfono del usuario y envía los pedidos directo al WhatsApp del negocio con detalle de productos y cálculo automático.
- **Precio Starter:** $180 único + $15/mes de hosting y soporte.
- **Precio Pro:** $350 con pasarela de cobro y panel de stock.`;
  } else if (lower.includes('comision') || lower.includes('ganancia') || lower.includes('porcentaje')) {
    fallbackReply = `💰 **Esquema de Comisiones para Vendedores:**

- **Comisión Base:** Ganás el **15% directo** del valor de cada venta cerrada.
- **Ejemplos:**
  - Miniapp Starter ($180) ➔ Ganás **$27.00**.
  - Miniapp Pro ($350) ➔ Ganás **$52.50**.
  - TurnosYa Suite ($280) ➔ Ganás **$42.00**.
  - Web Corporativa ($450) ➔ Ganás **$67.50**.
- **Bonus del Mes:** Superando 5 ventas en el mes, sumás un bono directo de **+$100** extra en tu liquidación.`;
  } else {
    fallbackReply = `¡Hola! Como tu asistente comercial Arfi, estoy para ayudarte a cerrar más ventas y mantener tus cuentas al día.

🎯 **Acciones recomendadas hoy:**
1. Revisa en la pestaña **Mantenimiento** los clientes con cuota próxima a vencer para enviar el recordatorio por WhatsApp.
2. Explora el **Catálogo de Emprendimientos** para conocer las características de Miniapp Pro y TurnosYa.
3. Puedes preguntarme cualquier objeción de cliente (*"No tengo tiempo"*, *"Ya uso Instagram"*) o pedirme un script personalizado.

¿Con qué prospecto o cliente quieres que trabajemos ahora?`;
  }

  res.json({ reply: fallbackReply, source: 'smart_engine' });
});

app.post('/api/arfi/recommendations', async (req, res) => {
  const { sellerName, currentSales, overdueClients } = req.body;

  if (aiClient) {
    try {
      const prompt = `Genera 3 recomendaciones estratégicas de última hora y alto impacto para el vendedor "${sellerName}".
Datos:
- Ventas cerradas este mes: ${currentSales || 0}
- Clientes con mantenimiento vencido o en mora: ${overdueClients?.length || 0}
- Listado de morosos: ${JSON.stringify(overdueClients || [])}

Devuelve una respuesta concisa y profesional con 3 puntos de acción directa.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      return res.json({ recommendation: response.text });
    } catch (e) {
      console.error('Error generating recommendations with Gemini:', e);
    }
  }

  // Fallback recommendations
  const recs = [
    `🎯 **Empujón de Cierre de Mes:** Tienes ${currentSales || 0} ventas registradas. Contacta a tus últimos 3 prospectos ofreciendo la bonificación del primer mes de mantenimiento si cierran hoy.`,
    `⚠️ **Atención a Morosidad:** Cuentas con ${overdueClients?.length || 0} clientes con cuota de mantenimiento pendiente. Enviar un recordatorio empático por WhatsApp antes de la suspensión programada asegura el 90% de recupero de fondos.`,
    `🚀 **Oportunidad de Cross-Selling:** Ofrece la integración de *Arfa Pagos* a los clientes que ya adquirieron *Miniapp Starter* para que puedan cobrar con tarjeta y links directos.`
  ].join('\n\n');

  res.json({ recommendation: recs });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Arfa Commercial Portal listening on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;

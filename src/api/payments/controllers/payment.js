const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

module.exports = {
  async createPreference(ctx) {
    try {
      const { propertyId } = ctx.request.body || {};
      if (!propertyId) {
        return ctx.badRequest('El propertyId es requerido');
      }

      // Buscar la propiedad para confirmar que existe
      const property = await strapi.entityService.findOne('api::property.property', propertyId, { 
        fields: ['title'] 
      });
      
      if (!property) return ctx.notFound('Propiedad no encontrada');

      // Configurar el cliente de MercadoPago
      const client = new MercadoPagoConfig({ 
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN 
      });
      const preference = new Preference(client);

      // Crear la preferencia
      const response = await preference.create({
        body: {
          items: [
            {
              id: String(propertyId),
              title: `Destacar Propiedad: ${property.title}`,
              quantity: 1,
              unit_price: 50000, // Costo fijo por destacar (por ejemplo)
            }
          ],
          metadata: {
            property_id: propertyId
          }
        }
      });

      return ctx.send({
        init_point: response.init_point,
        preferenceId: response.id
      });
    } catch (err) {
      strapi.log.error('Error al crear preferencia:', err);
      return ctx.internalServerError('Error al comunicarse con MercadoPago');
    }
  },

  async webhook(ctx) {
    try {
      const { query, body } = ctx.request;
      
      // MercadoPago manda el ID y tipo de evento de diferentes formas dependiendo de la config
      const topic = query.topic || body.type;
      const id = query.id || (body.data && body.data.id);

      // Solo nos interesa procesar pagos
      if (topic === 'payment' && id) {
        const client = new MercadoPagoConfig({ 
          accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN 
        });
        const paymentClient = new Payment(client);
        
        // Consultar el estado real del pago en MercadoPago por seguridad
        const paymentInfo = await paymentClient.get({ id });

        if (paymentInfo.status === 'approved') {
          // Extraer el property_id que pasamos en los metadatos al crear la preferencia
          const propertyId = paymentInfo.metadata?.property_id;
          
          if (propertyId) {
            // Actualizar la propiedad marcándola como destacada
            await strapi.entityService.update('api::property.property', propertyId, {
              data: { isFeatured: true }
            });
            strapi.log.info(`Pago ${id} aprobado. Propiedad ${propertyId} destacada con éxito.`);
          }
        }
      }

      // Siempre responder HTTP 200 a MercadoPago para que deje de enviar la notificación
      return ctx.send({ success: true });
    } catch (err) {
      strapi.log.error('Error procesando webhook de MercadoPago:', err);
      return ctx.send({ success: false });
    }
  }
};

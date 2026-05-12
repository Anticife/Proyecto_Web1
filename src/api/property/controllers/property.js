'use strict';

/**
 * property controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::property.property', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('Debes estar autenticado para crear una propiedad.');
    }

    if (!ctx.request.body.data) {
      ctx.request.body.data = {};
    }
    
    // Asignar el usuario actual como dueño de la propiedad
    ctx.request.body.data.owner = user.id;

    const response = await super.create(ctx);
    return response;
  }
}));

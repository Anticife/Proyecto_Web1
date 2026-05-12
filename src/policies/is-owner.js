module.exports = async (ctx, next) => {
  const { id } = ctx.params || {};
  const user = ctx.state.user;

  if (!user) {
    return ctx.unauthorized('You must be authenticated to perform this action');
  }

  if (!id) {
    return ctx.badRequest('Missing resource id');
  }

  try {
    const property = await strapi.entityService.findOne('api::property.property', id, { populate: ['owner'] });
    if (!property) return ctx.notFound('Property not found');

    const ownerId = property.owner && property.owner.id ? property.owner.id : property.owner;
    if (ownerId && ownerId === user.id) {
      return await next();
    }

    // Allow admin roles to bypass ownership check
    const roleName = user.role && user.role.name ? String(user.role.name).toLowerCase() : '';
    if (roleName === 'administrator' || roleName === 'admin') {
      return await next();
    }

    return ctx.forbidden('You are not the owner of this property');
  } catch (err) {
    strapi.log.error('Policy is-owner error:', err);
    return ctx.internalServerError('Policy error');
  }
};

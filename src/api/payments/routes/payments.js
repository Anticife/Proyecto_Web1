module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/payments/create-preference',
      handler: 'payment.createPreference',
      config: { auth: false }
    },
    {
      method: 'POST',
      path: '/payments/webhook',
      handler: 'payment.webhook',
      config: { auth: false }
    }
  ]
};

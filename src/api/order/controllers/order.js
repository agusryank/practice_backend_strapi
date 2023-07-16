"use strict";

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    console.log(ctx.request.body);
    const result = await super.create(ctx);

    const midtransClient = require("midtrans-client");
    // Create Snap API instance
    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: "SB-Mid-server-SXMe4HUG597_Hgc8YtJBE3RD",
      clientKey: "SB-Mid-client-v6jk6frNsXsXbLqr",
    });

    let parameter = {
      transaction_details: {
        order_id: result.data.id,
        gross_amount: result.data.attributes.totalPrice,
      },
      credit_card: {
        secure: true,
      },
    };

    let transaction = await snap.createTransaction(parameter);

    return transaction;
  },
}));

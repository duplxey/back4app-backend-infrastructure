Parse.Cloud.define("calculateProfit", async (request) => {
  const orderClass = Parse.Object.extend("Order");
  const orderQuery = new Parse.Query(orderClass);
  let profit = 0;

  try {
    const orders = await orderQuery.find();

    for (var i = 0; i < orders.length; i++) {
      let order = orders[i];
      let productId = order.get("product")["id"];
      
      const productClass = Parse.Object.extend("Product");
      const productQuery = new Parse.Query(productClass);
      const product = await productQuery.get(productId);
      
      profit += product.get("price");
    }
    return { 
      profit: profit,
    };
  } catch (error) {
    console.error("Error calculating the profit: " + error.message);
    return {
      profit: 0,
    }
  }
});

Parse.Cloud.job("printProfit", async (request, status) => {
  try {
    const result = await Parse.Cloud.run("calculateProfit");
    console.log("Profit: " + result.profit);
  } catch (error) {
    console.error("Error calculating the profit: " + error.message);
  }
});

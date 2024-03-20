const productModel = require("../models/productModel");
const transactionModel = require("../models/transactionModel");
const userModel = require("../models/userModel");

const newTransaction = async (req, res) => {
  try {
    const { totalPrice, amountPaid, user, orderedItems } = req.body;

    if (!totalPrice || !amountPaid || !user || !orderedItems) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // store it to database
    await transactionModel.create(req.body);

    // deduct the quantity of the order on the stocks
    for (let i = 0; i < orderedItems.length; i++) {
      const getProduct = await productModel.findOne({
        _id: orderedItems[i].productId,
      });

      if (getProduct) {
        // increment the sales
        getProduct.sales += orderedItems[i].quantity;

        // decrement the stocks
        getProduct.stocks -= orderedItems[i].quantity;
        await getProduct.save();
      }

      // console.log(i, getProduct);
    }

    return res.status(200).json({ message: "Transaction successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionModel
      .find()
      .populate({
        path: "user",
        model: "User",
      })
      .populate({
        path: "orderedItems",
        populate: {
          path: "productId",
          model: "Product",
        },
      });

    return res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getTransactionByMonth = async (req, res) => {
  try {
    // for monthly sales
    const transactions = await transactionModel.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month ascending
      },
    ]);

    // for total sales
    const allSales = await transactionModel.find();

    const totalSales = allSales.reduce((sum, sale) => {
      return sum + sale.totalPrice;
    }, 0);

    // the transaction count
    const totalOrders = await transactionModel.countDocuments();

    // count all the active products
    const activeProducts = await productModel.countDocuments({
      status: "active",
    });

    // get the  first best product by sale
    const bestProduct = await productModel.findOne().sort({ sales: -1 });

    // get the top 10 best product by sale
    const top10Products = await productModel
      .find()
      .sort({ sales: -1 })
      .limit(20);

    if (!top10Products || top10Products.length === 0) {
      return res.status(404).json({ message: "No top products" });
    }

    // chart data
    const transacs = await transactionModel.find().populate({
      path: "orderedItems",
      populate: {
        path: "productId",
        model: "Product",
      },
    });

    const getCategory = (category) => {
      switch (category) {
        case "appetizer":
          return "appetizer";
        case "soup":
          return "soup";
        case "main_course":
          return "main_course";
        case "dessert":
          return "dessert";
        case "drinks":
          return "drinks";
        default:
          break;
      }
    };

    let categorySales = {
      Appetizer: 0,
      Soup: 0,
      "Main Course": 0,
      Dessert: 0,
      Drinks: 0,
    };

    // loop all transaction
    transacs.forEach((transac) => {
      // loop all orderedItem each transaction
      transac.orderedItems.forEach((item) => {
        // check if it has category, because it my be empty if the product is deleted
        if (item.productId.category) {
          const category = getCategory(item.productId.category);

          // ayusin mo yung key ng object
          let transformedCategoryKey = "";
          switch (category) {
            case "appetizer":
              transformedCategoryKey = "Appetizer";
              break;
            case "soup":
              transformedCategoryKey = "Soup";
              break;
            case "main_course":
              transformedCategoryKey = "Main Course";
              break;
            case "dessert":
              transformedCategoryKey = "Dessert";
              break;
            case "drinks":
              transformedCategoryKey = "Drinks";
              break;
            default:
              break;
          }

          categorySales[transformedCategoryKey] += item.quantity;
        }
      });
    });

    return res.status(200).json({
      transactions,
      totalSales,
      totalOrders,
      activeProducts,
      bestProduct,
      top10Products,
      categorySales,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports = {
  newTransaction,
  getAllTransactions,
  getTransactionByMonth,
};

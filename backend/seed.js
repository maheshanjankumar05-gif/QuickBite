const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Food = require('./models/Food');
const Category = require('./models/Category');
const Order = require('./models/Order');

const categoriesData = [
  {
    name: 'Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
    description: 'Cheesy, stone-baked artisanal pizzas with fresh toppings',
  },
  {
    name: 'Burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
    description: 'Juicy gourmet burgers with crispy fries and secret sauces',
  },
  {
    name: 'Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
    description: 'Aromatic basmati rice cooked with rich royal spices',
  },
  {
    name: 'Chinese',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=80',
    description: 'Sizzling noodles, dim sums, and spicy wok delicacies',
  },
  {
    name: 'Desserts',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80',
    description: 'Decadent chocolate pastries, waffles, and sweet delights',
  },
  {
    name: 'Beverages',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&auto=format&fit=crop&q=80',
    description: 'Refreshing cold brews, mocktails, and fresh thick shakes',
  },
];

const foodsData = [
  // Pizza
  {
    name: 'Margherita Basilico',
    description: 'Classic sourdough crust, San Marzano tomato sauce, fresh mozzarella, and aromatic sweet basil leaves.',
    price: 299,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&auto=format&fit=crop&q=80',
    category: 'Pizza',
    rating: 4.8,
    prepTime: '20-25 min',
    isVeg: true,
    isAvailable: true,
    tags: ['Bestseller', 'Chef Special'],
  },
  {
    name: 'Spicy Pepperoni Feast',
    description: 'Loaded with smoky cured pepperoni slices, spicy jalapeños, and gooey melted mozzarella cheese.',
    price: 449,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80',
    category: 'Pizza',
    rating: 4.9,
    prepTime: '25-30 min',
    isVeg: false,
    isAvailable: true,
    tags: ['Popular', 'Spicy'],
  },
  {
    name: 'Farmhouse Veggie Supreme',
    description: 'Crisp bell peppers, red onions, black olives, sweet corn, mushrooms, and herb-seasoned paneer.',
    price: 369,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80',
    category: 'Pizza',
    rating: 4.6,
    prepTime: '20-25 min',
    isVeg: true,
    isAvailable: true,
    tags: ['Healthy Choice'],
  },
  {
    name: 'BBQ Smoked Chicken Pizza',
    description: 'Tender pulled chicken tossed in hickory BBQ sauce, caramelized onions, cilantro, and cheddar-mozzarella blend.',
    price: 479,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
    category: 'Pizza',
    rating: 4.7,
    prepTime: '25-30 min',
    isVeg: false,
    isAvailable: true,
    tags: ['Trending'],
  },

  // Burger
  {
    name: 'Classic Double Cheeseburger',
    description: 'Double grilled flame-seared patties, double American melted cheddar, pickles, crisp lettuce, and special sauce.',
    price: 249,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    category: 'Burger',
    rating: 4.8,
    prepTime: '15-20 min',
    isVeg: false,
    isAvailable: true,
    tags: ['Bestseller'],
  },
  {
    name: 'Crispy Paneer Royale Burger',
    description: 'Golden fried herb-infused paneer patty topped with chipotle mayonnaise, tangy slaw, and ripe tomato.',
    price: 219,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    category: 'Burger',
    rating: 4.6,
    prepTime: '15-20 min',
    isVeg: true,
    isAvailable: true,
    tags: ['Must Try'],
  },
  {
    name: 'Fiery Crispy Chicken Zinger',
    description: 'Hand-breaded crunchy chicken breast glazed with spicy peri-peri dust, creamy garlic dip, and toasted brioche.',
    price: 279,
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80',
    category: 'Burger',
    rating: 4.9,
    prepTime: '18-22 min',
    isVeg: false,
    isAvailable: true,
    tags: ['Spicy', 'Trending'],
  },
  {
    name: 'Truffle Mushroom Swiss Burger',
    description: 'Sautéed portobello mushrooms, real truffle aioli, Swiss cheese, and baby spinach on toasted seeded bun.',
    price: 299,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
    category: 'Burger',
    rating: 4.7,
    prepTime: '20-25 min',
    isVeg: true,
    isAvailable: true,
    tags: ['Gourmet'],
  },

  // Biryani
  {
    name: 'Royal Hyderabadi Dum Biryani',
    description: 'Slow-cooked succulent tender chicken marinated in 21 secret Nizami spices, fragrant basmati rice & fried onions.',
    price: 389,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    category: 'Biryani',
    rating: 4.9,
    prepTime: '30-35 min',
    isVeg: false,
    isAvailable: true,
    tags: ['Bestseller', 'Royal Special'],
  },
  {
    name: 'Lucknowi Shahi Paneer Biryani',
    description: 'Charcoal grilled cottage cheese chunks layered with saffron-infused long grain basmati rice and fresh mint.',
    price: 329,
    image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=600&auto=format&fit=crop&q=80',
    category: 'Biryani',
    rating: 4.7,
    prepTime: '25-30 min',
    isVeg: true,
    isAvailable: true,
    tags: ['Vegetarian Special'],
  },
  {
    name: 'Awadhi Mutton Dum Biryani',
    description: 'Melt-in-mouth tender goat meat slow-cooked in sealed earthen handi with kewra essence, saffron, and whole spices.',
    price: 499,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80',
    category: 'Biryani',
    rating: 4.9,
    prepTime: '35-40 min',
    isVeg: false,
    isAvailable: true,
    tags: ['Chef Special'],
  },

  // Chinese
  {
    name: 'Schezwan Chili Garlic Noodles',
    description: 'Wok-tossed handmade hakka noodles with crisp julienned vegetables, fiery schezwan paste, and spring onions.',
    price: 229,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80',
    category: 'Chinese',
    rating: 4.6,
    prepTime: '15-20 min',
    isVeg: true,
    isAvailable: true,
    tags: ['Spicy', 'Popular'],
  },
  {
    name: 'Crispy Honey Chili Potatoes',
    description: 'Golden fried potato batons coated with sweet spicy chili-honey glaze, toasted sesame seeds, and scallions.',
    price: 199,
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80',
    category: 'Chinese',
    rating: 4.7,
    prepTime: '15-20 min',
    isVeg: true,
    isAvailable: true,
    tags: ['Crispy'],
  },
  {
    name: 'Kung Pao Chicken Wok Bowl',
    description: 'Diced tender chicken stir-fried with roasted crunchy peanuts, red chilies, bell peppers, and savory hoisin sauce.',
    price: 349,
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&auto=format&fit=crop&q=80',
    category: 'Chinese',
    rating: 4.8,
    prepTime: '20-25 min',
    isVeg: false,
    isAvailable: true,
    tags: ['Authentic'],
  },
  {
    name: 'Steamed Crystal Veg Dimsums (6 pcs)',
    description: 'Translucent steamed dumplings packed with finely minced shiitake mushrooms, water chestnuts, and spicy dip.',
    price: 249,
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&auto=format&fit=crop&q=80',
    category: 'Chinese',
    rating: 4.8,
    prepTime: '15-20 min',
    isVeg: true,
    isAvailable: true,
    tags: ['Healthy'],
  },

  // Desserts
  {
    name: 'Warm Belgian Chocolate Lava Cake',
    description: 'Gourmet rich dark chocolate cake with a molten liquid ganache center, served warm with vanilla essence.',
    price: 189,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    category: 'Desserts',
    rating: 4.9,
    prepTime: '10-15 min',
    isVeg: true,
    isAvailable: true,
    tags: ['Bestseller', 'Sweet Tooth'],
  },
  {
    name: 'New York Baked Cheesecake',
    description: 'Velvety smooth Philadelphia cream cheese filling on a buttery graham cracker crust, topped with berry compote.',
    price: 249,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80',
    category: 'Desserts',
    rating: 4.8,
    prepTime: '10 min',
    isVeg: true,
    isAvailable: true,
    tags: ['Signature'],
  },
  {
    name: 'Classic Tiramisu Cup',
    description: 'Espresso-soaked savoiardi ladyfingers layered with whipped mascarpone cream and dusted with fine Dutch cocoa.',
    price: 229,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80',
    category: 'Desserts',
    rating: 4.7,
    prepTime: '10 min',
    isVeg: true,
    isAvailable: true,
    tags: ['Italian Classic'],
  },

  // Beverages
  {
    name: 'Signature Cold Brew Iced Coffee',
    description: '18-hour slow steeped Arabica coffee poured over artisan ice rocks with silky vanilla milk foam.',
    price: 169,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
    category: 'Beverages',
    rating: 4.7,
    prepTime: '5-10 min',
    isVeg: true,
    isAvailable: true,
    tags: ['Refreshing'],
  },
  {
    name: 'Virgin Mojito Mint Cooler',
    description: 'Crushed garden fresh mint leaves, zesty lemon juice, simple syrup, and bubbly chilled club soda.',
    price: 139,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    category: 'Beverages',
    rating: 4.6,
    prepTime: '5-8 min',
    isVeg: true,
    isAvailable: true,
    tags: ['Summer Cooler'],
  },
  {
    name: 'Belgian Chocolate Thick Shake',
    description: 'Ultra thick milkshake blended with pure dark Belgian chocolate, fudge brownies, and chocolate whipped cream.',
    price: 199,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
    category: 'Beverages',
    rating: 4.9,
    prepTime: '8-12 min',
    isVeg: true,
    isAvailable: true,
    tags: ['Decadent'],
  },
];

const seedDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quickbite';
    console.log(`Connecting to MongoDB at: ${uri}`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB for seeding');

    // Clear existing data
    await Promise.all([
      Category.deleteMany({}),
      Food.deleteMany({}),
      User.deleteMany({}),
      Order.deleteMany({}),
    ]);
    console.log('Cleared existing collections');

    // Seed Categories
    const insertedCategories = await Category.insertMany(categoriesData);
    console.log(` Inserted ${insertedCategories.length} Categories`);

    // Seed Foods
    const insertedFoods = await Food.insertMany(foodsData);
    console.log(` Inserted ${insertedFoods.length} Food items`);

    // Create Admin User
    const adminUser = await User.create({
      name: 'QuickBite Admin',
      email: 'admin@quickbite.com',
      password: 'admin123', // Will be hashed by User pre-save hook
      phone: '+91 98765 43210',
      address: {
        street: 'QuickBite HQ, Tech Park',
        city: 'New Delhi',
        postalCode: '110001',
        state: 'Delhi',
      },
      role: 'admin',
    });
    console.log(' Created Admin User: admin@quickbite.com / admin123');

    // Create Demo Customer User
    const demoUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123', // Will be hashed by User pre-save hook
      phone: '+91 91234 56789',
      address: {
        street: '42 Blossom Avenue, Flat 3B',
        city: 'New Delhi',
        postalCode: '110016',
        state: 'Delhi',
      },
      role: 'user',
    });
    console.log(' Created Demo User: john@example.com / user123');

    // Seed sample initial orders for realistic dashboard metrics
    const sampleOrders = [
      {
        user: demoUser._id,
        items: [
          {
            food: insertedFoods[0]._id,
            name: insertedFoods[0].name,
            price: insertedFoods[0].price,
            quantity: 2,
            image: insertedFoods[0].image,
          },
          {
            food: insertedFoods[4]._id,
            name: insertedFoods[4].name,
            price: insertedFoods[4].price,
            quantity: 1,
            image: insertedFoods[4].image,
          },
        ],
        subtotal: insertedFoods[0].price * 2 + insertedFoods[4].price,
        deliveryFee: 0,
        tax: 42,
        totalAmount: insertedFoods[0].price * 2 + insertedFoods[4].price + 42,
        customerDetails: {
          name: demoUser.name,
          email: demoUser.email,
          phone: demoUser.phone,
          address: demoUser.address.street,
          city: demoUser.address.city,
          postalCode: demoUser.address.postalCode,
          notes: 'Please ring the doorbell twice',
        },
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Pending',
        orderStatus: 'Preparing',
      },
      {
        user: demoUser._id,
        items: [
          {
            food: insertedFoods[8]._id,
            name: insertedFoods[8].name,
            price: insertedFoods[8].price,
            quantity: 1,
            image: insertedFoods[8].image,
          },
        ],
        subtotal: insertedFoods[8].price,
        deliveryFee: 40,
        tax: 20,
        totalAmount: insertedFoods[8].price + 60,
        customerDetails: {
          name: demoUser.name,
          email: demoUser.email,
          phone: demoUser.phone,
          address: demoUser.address.street,
          city: demoUser.address.city,
          postalCode: demoUser.address.postalCode,
          notes: 'Leave at door',
        },
        paymentMethod: 'Online',
        paymentStatus: 'Paid',
        orderStatus: 'Delivered',
      },
    ];

    await Order.insertMany(sampleOrders);
    console.log(` Inserted ${sampleOrders.length} Sample Orders`);

    console.log(' Seeding completed successfully!');
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error(' Seeding Failed:', error.message);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;


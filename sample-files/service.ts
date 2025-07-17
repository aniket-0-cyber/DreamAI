import { Product, Order, Customer } from './types';
import { generateId, validateEmail } from './utils';

export class ProductService {
  private products: Product[] = [
    {
      id: 'prod_001',
      name: 'Laptop',
      price: 999.99,
      category: 'Electronics',
      inStock: true
    },
    {
      id: 'prod_002',
      name: 'Coffee Mug',
      price: 15.99,
      category: 'Kitchen',
      inStock: false
    }
  ];

  getProductById(id: string): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  getAllProducts(): Product[] {
    return this.products;
  }

  addProduct(product: Omit<Product, 'id'>): Product {
    const newProduct: Product = {
      ...product,
      id: generateId()
    };
    this.products.push(newProduct);
    return newProduct;
  }
}

export class OrderService {
  private orders: Order[] = [];

  createOrder(customerId: string, items: Product[]): Order {
    const total = items.reduce((sum, item) => sum + item.price, 0);
    
    const order: Order = {
      orderId: generateId(),
      customerId,
      items,
      total,
      status: 'pending',
      createdAt: new Date()
    };

    this.orders.push(order);
    return order;
  }

  getOrderById(orderId: string): Order | undefined {
    return this.orders.find(order => order.orderId === orderId);
  }
} 
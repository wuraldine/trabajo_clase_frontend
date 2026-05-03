import { useEffect, useMemo, useState } from 'react';

import Footer from './components/Footer';
import Header from './components/Header';
import Cart from './pages/Cart';
import CategoryProducts from './pages/CategoryProducts';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import OrderConfirmation from './pages/OrderConfirmation';
import ProductList from './pages/ProductList';
import {
  calculateOrderTotals,
  getPaymentMethodById,
  getShippingOptionById,
} from './utils/calculateOrderTotals';
import { CART_STORAGE_KEY, loadCartItems } from './utils/cartStorage';
import { saveOrder } from './utils/ordersStorage';

import './App.css';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cartItems, setCartItems] = useState(loadCartItems);
  const [latestOrder, setLatestOrder] = useState(null);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const handleNavigate = (page) => {
    setActivePage(page);
    if (page !== 'category') {
      setSelectedCategory(null);
    }
  };

  const handleOpenCategory = (category) => {
    setSelectedCategory(category);
    setActivePage('category');
  };

  const handleBackFromCategory = () => {
    setSelectedCategory(null);
    setActivePage('home');
  };

  const handleAddToCart = (product) => {
    if (!product || !Number.isFinite(Number(product.id))) {
      return;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      const stock =
        Number.isFinite(Number(product.stock)) && Number(product.stock) > 0
          ? Number(product.stock)
          : 1;

      if (!existingItem) {
        return [
          ...currentItems,
          {
            id: Number(product.id),
            name: product.name,
            category: product.category,
            price: Number(product.price) || 0,
            stock,
            image: product.image,
            quantity: 1,
          },
        ];
      }

      return currentItems.map((item) => {
        if (item.id !== product.id) {
          return item;
        }

        return {
          ...item,
          stock,
          quantity: Math.min(item.quantity + 1, stock),
        };
      });
    });
  };

  const handleUpdateCartItemQuantity = (productId, delta) => {
    setCartItems((currentItems) =>
      currentItems.flatMap((item) => {
        if (item.id !== productId) {
          return [item];
        }

        const stock =
          Number.isFinite(Number(item.stock)) && Number(item.stock) > 0 ? Number(item.stock) : 1;
        const nextQuantity = Math.floor(Number(item.quantity) + Number(delta));

        if (nextQuantity <= 0) {
          return [];
        }

        return [{ ...item, quantity: Math.min(stock, nextQuantity) }];
      })
    );
  };

  const handleRemoveCartItem = (productId) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleStartCheckout = () => {
    setActivePage('checkout');
  };

  const handleCompleteCheckout = ({ customer, shippingMethodId, paymentMethodId }) => {
    if (cartItems.length === 0) {
      setActivePage('cart');
      return;
    }

    const totals = calculateOrderTotals(cartItems, shippingMethodId);
    const order = {
      id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      items: cartItems.map((item) => ({ ...item })),
      customer,
      shippingMethod: getShippingOptionById(shippingMethodId),
      paymentMethod: getPaymentMethodById(paymentMethodId),
      totals,
    };

    saveOrder(order);
    setLatestOrder(order);
    setCartItems([]);
    setActivePage('order-confirmation');
  };

  const handleBackHomeAfterOrder = () => {
    setLatestOrder(null);
    setSelectedCategory(null);
    setActivePage('home');
  };

  const cartItemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  let page = <Home onOpenCategory={handleOpenCategory} />;

  if (activePage === 'category') {
    page = (
      <CategoryProducts
        category={selectedCategory}
        onBack={handleBackFromCategory}
        cartItems={cartItems}
        onAddToCart={handleAddToCart}
      />
    );
  } else if (activePage === 'products') {
    page = <ProductList onAddToCart={handleAddToCart} />;
  } else if (activePage === 'cart') {
    page = (
      <Cart
        cartItems={cartItems}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartItemQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onContinueShopping={() => handleNavigate('products')}
        onProceedToCheckout={handleStartCheckout}
      />
    );
  } else if (activePage === 'checkout') {
    page = (
      <Checkout
        cartItems={cartItems}
        user={user}
        onBack={() => handleNavigate('cart')}
        onCompleteCheckout={handleCompleteCheckout}
      />
    );
  } else if (activePage === 'order-confirmation') {
    page = <OrderConfirmation order={latestOrder} onBackHome={handleBackHomeAfterOrder} />;
  }

  const handleSignIn = () => {
    setUser({ name: 'Usuario' });
  };

  const handleSignOut = () => {
    setUser(null);
  };

  return (
    <div className="app">
      <Header
        activePage={activePage}
        onNavigate={handleNavigate}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        cartItemCount={cartItemCount}
      />
      <main className="main">{page}</main>
      <Footer />
    </div>
  );
}

export default App;
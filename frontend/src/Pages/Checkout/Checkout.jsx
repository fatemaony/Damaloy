import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import useAuth from '../../Hooks/useAuth';
import useAxios from '../../Hooks/useAxios';
import { Loader2, MapPin, CreditCard, Truck } from 'lucide-react';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

const CheckoutForm = ({ cartItems, totalPrice, address, user, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosInstance = useAxios();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'stripe' or 'cod'

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!address) {
      setError("Please provide a shipping address.");
      setProcessing(false);
      return;
    }

    try {
      if (paymentMethod === 'stripe') {
        if (!stripe || !elements) {
          setProcessing(false);
          return;
        }

        const cardElement = elements.getElement(CardElement);

        // Create Payment Method
        const { error: paymentMethodError, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

        if (paymentMethodError) {
          setError(paymentMethodError.message);
          setProcessing(false);
          return;
        }
      }

      // Create Order on Backend
      const orderData = {
        user_id: user.id,
        payment_method: paymentMethod,
        shipping_address: address,
      };

      const response = await axiosInstance.post('/api/orders', orderData);

      if (response.data.success) {
        if (paymentMethod === 'stripe') {
          const clientSecret = response.data.clientSecret;
          const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: {
                name: user.name,
                email: user.email,
              },
            },
          });

          if (result.error) {
            setError(result.error.message);
            // Optionally cancel order on backend or mark as failed
          } else {
            if (result.paymentIntent.status === 'succeeded') {
              onSuccess(response.data.data);
            }
          }
        } else {
          onSuccess(response.data.data);
        }
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      setError(err.response?.data?.message || "An error occurred during checkout.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Payment Method</h3>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer border p-4 rounded-lg flex-1 hover:bg-base-200 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={() => setPaymentMethod('cod')}
              className="radio radio-primary"
            />
            <Truck className="w-5 h-5" />
            <span>Cash on Delivery</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer border p-4 rounded-lg flex-1 hover:bg-base-200 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="stripe"
              checked={paymentMethod === 'stripe'}
              onChange={() => setPaymentMethod('stripe')}
              className="radio radio-primary"
            />
            <CreditCard className="w-5 h-5" />
            <span>Credit Card (Stripe)</span>
          </label>
        </div>
      </div>

      {paymentMethod === 'stripe' && (
        <div className="p-4 border rounded-lg bg-base-100">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }} />
        </div>
      )}

      {error && <div className="text-error text-sm">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn btn-primary w-full"
      >
        {processing ? <Loader2 className="animate-spin" /> : `Pay $${totalPrice.toFixed(2)}`}
      </button>
    </form>
  );
};

const Checkout = () => {
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user?.email) {
      fetchData();
    }
  }, [user, axiosInstance]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch User Data for ID and Address
      const userRes = await axiosInstance.get(`/api/users/email/${user.email}`);
      if (userRes.data.success) {
        const uData = userRes.data.data;
        setUserData(uData);
        setAddress(uData.address || '');

        // Fetch Cart
        const cartRes = await axiosInstance.get(`/api/cart/${uData.id}`);
        if (cartRes.data.success) {
          setCartItems(cartRes.data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressUpdate = async () => {
    if (!address.trim()) return;
    try {
      const response = await axiosInstance.put(`/api/users/address/${userData.id}`, { address });
      if (response.data.success) {
        setIsEditingAddress(false);
        Swal.fire('Success', 'Address updated successfully', 'success');
      }
    } catch (error) {
      console.error("Error updating address:", error);
      Swal.fire('Error', 'Failed to update address', 'error');
    }
  };

  const handleSuccess = (order) => {
    Swal.fire('Success', 'Order placed successfully!', 'success').then(() => {
      navigate('/dashboard/my-orders');
    });
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-base-200">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-base-200 gap-4">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <button onClick={() => navigate('/products')} className="btn btn-primary">Go Shopping</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Left Column: Address & Order Summary */}
        <div className="space-y-6">
          {/* Address Section */}
          <div className="bg-base-100 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Shipping Address
              </h2>
              <button
                onClick={() => setIsEditingAddress(!isEditingAddress)}
                className="text-primary text-sm hover:underline"
              >
                {isEditingAddress ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditingAddress ? (
              <div className="space-y-3">
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="textarea textarea-bordered w-full"
                  placeholder="Enter your full address..."
                  rows="3"
                ></textarea>
                <button onClick={handleAddressUpdate} className="btn btn-sm btn-primary">Save Address</button>
              </div>
            ) : (
              <p className="text-gray-600 whitespace-pre-wrap">
                {address || "No address provided. Please add one."}
              </p>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-base-100 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-base-200 rounded overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <span>{item.quantity} x {item.name}</span>
                  </div>
                  <span className="font-medium">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="divider"></div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Payment */}
        <div className="bg-base-100 p-6 rounded-xl shadow-sm h-fit">
          <h2 className="text-2xl font-bold mb-6">Checkout</h2>
          <Elements stripe={stripePromise}>
            <CheckoutForm
              cartItems={cartItems}
              totalPrice={totalPrice}
              address={address}
              user={userData}
              onSuccess={handleSuccess}
            />
          </Elements>
        </div>

      </div>
    </div>
  );
};

export default Checkout;

import React, { useState, useEffect } from 'react';
import { Store, Package, DollarSign, Ruler, Image as ImageIcon, FileText, Save, Loader2, ArrowLeft } from 'lucide-react';
import useAxios from '../../../Hooks/useAxios';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import useAuth from '../../../Hooks/useAuth';
import { useParams, useNavigate } from 'react-router';

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [sellerInfo, setSellerInfo] = useState(null);

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: '',
      image: '',
      price: '',
      unit: '',
      quantity: '',
      discount: '',
      description: ''
    }
  });

  const imageUrl = watch('image');

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) return;
      setFetching(true);
      try {
        // Fetch Seller Info
        const sellerRes = await axiosInstance.get(`/api/sellers/email/${user.email}`);
        if (sellerRes.data.success) {
          setSellerInfo(sellerRes.data.data);
        }

        // Fetch Product Details
        const productRes = await axiosInstance.get(`/api/products/${id}`);
        if (productRes.data.success) {
          const product = productRes.data.data;
          // Check if product belongs to seller
          if (sellerRes.data.success && product.seller_id !== sellerRes.data.data.id) {
            Swal.fire('Error', 'You do not have permission to edit this product.', 'error');
            navigate('/dashboard/seller/myProducts');
            return;
          }

          setValue('name', product.name);
          setValue('image', product.image);
          setValue('price', product.price);
          setValue('unit', product.unit);
          setValue('quantity', product.quantity);
          setValue('discount', product.discount || 0);
          setValue('description', product.description);
        }
      } catch (error) {
        console.error("Error fetching data", error);
        Swal.fire('Error', 'Failed to load product details.', 'error');
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [axiosInstance, user, id, setValue, navigate]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY || 'YOUR_IMGBB_API_KEY_HERE';
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setValue('image', data.data.url);
        Swal.fire({
          icon: 'success',
          title: 'Image Uploaded!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error("Error uploading image", error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Could not upload image. Please try again.',
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const payload = {
        ...data,
        seller_id: sellerInfo?.id // Ensure seller_id is preserved/sent if needed, though update usually doesn't change it
      };

      const response = await axiosInstance.put(`/api/products/${id}`, payload);

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Product Updated!',
          text: 'Your product has been updated successfully.',
          showConfirmButton: false,
          timer: 1500
        });
        navigate('/dashboard/seller/myProducts');
      }
    } catch (error) {
      console.error("Error updating product", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate('/dashboard/seller/myProducts')}
        className="flex items-center text-gray-600 hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to My Products
      </button>

      <h1 className="text-3xl font-bold mb-8 text-primary flex items-center gap-2">
        <Edit className="h-8 w-8 text-primary" />
        Update Product
      </h1>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            <div className="bg-blue-50 p-4 rounded-lg border text-primary border-primary mb-6">
              <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                <Store className="h-4 w-4" />
                Store Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-primary">
                <div>
                  <span className="font-medium">Store Name:</span> {sellerInfo?.store_name || 'Loading...'}
                </div>
                <div>
                  <span className="font-medium">Category:</span> {sellerInfo?.store_category || 'Loading...'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Product Name
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Product name is required" })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  placeholder="e.g. Organic Bananas"
                />
                {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Price
                </label>
                <input
                  type="number"
                  {...register("price", { required: "Price is required", min: 0 })}
                  step="0.01"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  placeholder="0.00"
                />
                {errors.price && <span className="text-red-500 text-xs">{errors.price.message}</span>}
              </div>

              {/* Unit */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  Unit
                </label>
                <select
                  {...register("unit", { required: "Unit is required" })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                >
                  <option value="">Select Unit</option>
                  <option value="kg">Kg</option>
                  <option value="gm">Gram</option>
                  <option value="ltr">Liter</option>
                  <option value="pc">Piece</option>
                  <option value="box">Box</option>
                  <option value="dozen">Dozen</option>
                </select>
                {errors.unit && <span className="text-red-500 text-xs">{errors.unit.message}</span>}
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Quantity
                </label>
                <input
                  type="number"
                  {...register("quantity", { required: "Quantity is required", min: 0 })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  placeholder="0"
                />
                {errors.quantity && <span className="text-red-500 text-xs">{errors.quantity.message}</span>}
              </div>

              {/* Discount */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Discount (%)
                </label>
                <input
                  type="number"
                  {...register("discount", { min: 0, max: 100 })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  placeholder="0"
                />
                {errors.discount && <span className="text-red-500 text-xs">{errors.discount.message}</span>}
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Product Image
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary"
                  />
                  {uploading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                </div>
                {imageUrl && (
                  <div className="mt-2">
                    <img src={imageUrl} alt="Preview" className="h-20 w-20 object-cover rounded-lg border border-gray-200" />
                  </div>
                )}
                <input type="hidden" {...register("image")} />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Description
              </label>
              <textarea
                {...register("description")}
                rows="4"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
                placeholder="Describe your product..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-primary hover:bg-primary/80 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Update Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

function Edit(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

export default UpdateProduct;
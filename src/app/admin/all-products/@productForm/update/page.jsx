"use client";
import { useRouter } from "next/navigation";

export default function UpdateProductModal() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <h2>Update Product</h2>
        <button onClick={() => router.back()}>Close</button>
      </div>
    </div>
  );
}

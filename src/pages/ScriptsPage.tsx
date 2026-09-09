import { useState } from "react";
import "./ScriptsPage.css";
import { specificApi, type ProductInfo } from "../api/specific";

export function ScriptsPage() {
  const [productCode, setProductCode] = useState("");
  const [product, setProduct] = useState<ProductInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const code = productCode.trim();

    if (!code) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await specificApi.getPriceForNomen(code);
      setProduct(data);
    } catch (error) {
      setProduct(null);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load product information.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="management-panel">
      <div className="section-heading">
        <div>
          <h2>Product Prices</h2>
          <p>Search product information and prices by product code.</p>
        </div>
      </div>

      <div className="scripts-content">
        {/* Search */}
        <div className="content-card">
          <div className="form-row">
            <input
              type="text"
              className="form-input"
              placeholder="Code"
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>

        {product && (
          <>
            {/* Product information */}
            <div className="content-card">
              <h3>Product Information</h3>

              <div className="product-info">
                <div>
                  <span>Code: </span>
                  <strong>{product.product_code}</strong>
                </div>
              </div>
              <div className="product-info">
                <div>
                  <span>Product: </span>
                  <strong>{product.product_name}</strong>
                </div>
              </div>
            </div>

            {/* Prices */}
            <div className="content-card">
              <h3>Prices</h3>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Warehouse</th>
                    <th>Quantity</th>
                    <th>Unit Cost</th>
                    <th>Price S</th>
                    <th>Price Ultra</th>
                    <th>Price Enter</th>
                  </tr>
                </thead>

                <tbody>
                  {product.prices.map((price, index) => (
                    <tr key={`${price.warehouse_name}-${index}`}>
                      <td>{price.warehouse_name}</td>
                      <td>{price.quantity}</td>
                      <td>{price.unit_cost}</td>
                      <td>{price.price_s}</td>
                      <td>{price.price_ultra}</td>
                      <td>{price.price_enter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

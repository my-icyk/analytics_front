import { useState, type ReactNode } from "react";
import "./ScriptsPage.css";
import { specificApi, type ProductInfo } from "../api/specific";

type ScriptsPageProps = {
  username: string;
};

type ScriptBlockProps = {
  title: string;
  description: string;
  children: ReactNode;
};

// Shared shell every script uses: title/description header, params + button, then output.
function ScriptBlock({ title, description, children }: ScriptBlockProps) {
  return (
    <article className="script-block">
      <div className="script-block-header">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="script-block-body">{children}</div>
    </article>
  );
}

function ProductPriceScript() {
  const [productCode, setProductCode] = useState("");
  const [product, setProduct] = useState<ProductInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const code = productCode.trim();
    if (!code) return;

    setLoading(true);
    setError(null);

    try {
      const data = await specificApi.getPriceForNomen(code);
      setProduct(data);
    } catch (err) {
      setProduct(null);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load product information.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScriptBlock
      title="Product price lookup"
      description="Search product information and prices by product code."
    >
      <div className="script-form-row">
        <input
          type="text"
          className="script-input"
          placeholder="Product code"
          value={productCode}
          onChange={(event) => setProductCode(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSearch();
          }}
        />
        <button
          type="button"
          className="primary-button compact-button"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {error && <p className="script-error">{error}</p>}

      {product && (
        <div className="script-output">
          <div className="script-summary">
            <div>
              <span className="script-summary-label">Code</span>
              <strong>{product.product_code}</strong>
            </div>
            <div>
              <span className="script-summary-label">Product</span>
              <strong>{product.product_name}</strong>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Warehouse</th>
                  <th>Quantity</th>
                  <th>Unit cost</th>
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
        </div>
      )}
    </ScriptBlock>
  );
}

function HelloScript({ username }: { username: string }) {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <ScriptBlock
      title="Say hello"
      description="Placeholder script — will grow into something more useful later."
    >
      <div className="script-form-row">
        <button
          type="button"
          className="primary-button compact-button"
          onClick={() => setMessage(`Hello, ${username}!`)}
        >
          Run
        </button>
      </div>

      {message && (
        <div className="script-output">
          <p className="script-message">{message}</p>
        </div>
      )}
    </ScriptBlock>
  );
}

export function ScriptsPage({ username }: ScriptsPageProps) {
  return (
    <section className="management-panel">
      <div className="section-heading">
        <div>
          <h2>Scripts</h2>
          <p>Run internal tools and utility scripts. Scroll down for more.</p>
        </div>
      </div>

      <div className="scripts-list">
        <ProductPriceScript />
        <HelloScript username={username} />
      </div>
    </section>
  );
}

import { CartItem } from "../types/cart";
import { Address } from "../../states/address/types";

interface GenerateReceiptProps {
  orderNumber: string;
  items: CartItem[];
  address: Address;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingMethod: "standard" | "express";
}

export const generateReceiptHTML = ({
  orderNumber,
  items,
  address,
  subtotal,
  shippingCost,
  tax,
  total,
  shippingMethod,
}: GenerateReceiptProps): string => {
  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} ريال`;
  };

  const itemsHTML = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        ${item.name}
        ${
          item.features
            ? `<br><span style="color: #666; font-size: 12px;">
               ${item.features.color ? `اللون: ${item.features.color}` : ""}
               ${item.features.storage ? `السعة: ${item.features.storage}` : ""}
               ${item.features.ram ? `الذاكرة: ${item.features.ram}` : ""}
               </span>`
            : ""
        }
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${
        item.quantity
      }</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${
        item.price
      }</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${
        parseFloat(item.price.replace(/[^\d.]/g, "")) * item.quantity
      } ريال</td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #0066FF;
          margin-bottom: 10px;
        }
        .order-info {
          margin-bottom: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th {
          background-color: #f8f9fa;
          padding: 12px;
          text-align: right;
        }
        .totals {
          margin-top: 20px;
          border-top: 2px solid #eee;
          padding-top: 20px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .grand-total {
          font-size: 18px;
          font-weight: bold;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 2px solid #eee;
        }
        .shipping-info {
          margin-top: 30px;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 8px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">أطلس</div>
        <div>فاتورة طلب</div>
      </div>

      <div class="order-info">
        <div>رقم الطلب: ${orderNumber}</div>
        <div>التاريخ: ${new Date().toLocaleDateString("ar-SA")}</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>المنتج</th>
            <th>الكمية</th>
            <th>السعر</th>
            <th>المجموع</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <div class="totals">
        <div class="total-row">
          <span>المجموع الفرعي:</span>
          <span>${formatPrice(subtotal)}</span>
        </div>
        <div class="total-row">
          <span>الشحن (${
            shippingMethod === "express" ? "سريع" : "قياسي"
          }):</span>
          <span>${formatPrice(shippingCost)}</span>
        </div>
        <div class="total-row">
          <span>الضريبة (15%):</span>
          <span>${formatPrice(tax)}</span>
        </div>
        <div class="total-row grand-total">
          <span>المجموع الكلي:</span>
          <span>${formatPrice(total)}</span>
        </div>
      </div>

      <div class="shipping-info">
        <h3>معلومات الشحن</h3>
        <p>
          ${address.name}<br>
          ${address.street}<br>
          ${address.city}, ${address.state}<br>
          ${address.country}
        </p>
        <p>
          <strong>طريقة الشحن:</strong> ${
            shippingMethod === "express"
              ? "شحن سريع (1-2 يوم عمل)"
              : "شحن قياسي (3-5 أيام عمل)"
          }
        </p>
      </div>
    </body>
    </html>
  `;
};

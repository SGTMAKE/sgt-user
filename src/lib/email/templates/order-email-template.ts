import { formatCurrency, formateDateString } from "@/lib/utils"
import type { ItemSummary, AddressProps } from "@/lib/types/types"

interface OrderEmailData {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  orderDate: Date
  totalAmount: number
  orderItems: ItemSummary[]
  shippingAddress: AddressProps
  paymentStatus: boolean
  paymentMethod?: string
}

export const generateOrderEmailTemplate = (data: OrderEmailData) => {
  const {
    orderId,
    customerName,
    customerEmail,
    customerPhone,
    orderDate,
    totalAmount,
    orderItems,
    shippingAddress,
    paymentStatus,
    paymentMethod,
  } = data

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Received - ${orderId}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f8f9fa;
            }
            
            .container {
                max-width: 800px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            
            .header h1 {
                font-size: 28px;
                margin-bottom: 10px;
                font-weight: 600;
            }
            
            .header p {
                font-size: 16px;
                opacity: 0.9;
            }
            
            .content {
                padding: 30px;
            }
            
            .order-summary {
                background-color: #f8f9fa;
                border-radius: 12px;
                padding: 25px;
                margin-bottom: 30px;
                border-left: 4px solid #667eea;
            }
            
            .order-info {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 25px;
            }
            
            .info-item {
                background: white;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            
            .info-label {
                font-size: 12px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 5px;
                font-weight: 600;
            }
            
            .info-value {
                font-size: 16px;
                font-weight: 600;
                color: #333;
            }
            
            .status-badge {
                display: inline-block;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .status-paid {
                background-color: #d4edda;
                color: #155724;
            }
            
            .status-pending {
                background-color: #fff3cd;
                color: #856404;
            }
            
            .section-title {
                font-size: 20px;
                font-weight: 600;
                color: #333;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 2px solid #e9ecef;
            }
            
            .items-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            
            .items-table th {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px;
                text-align: left;
                font-weight: 600;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .items-table td {
                padding: 15px;
                border-bottom: 1px solid #e9ecef;
                vertical-align: top;
            }
            
            .items-table tr:last-child td {
                border-bottom: none;
            }
            
            .items-table tr:nth-child(even) {
                background-color: #f8f9fa;
            }
            
            .item-image {
                width: 60px;
                height: 60px;
                object-fit: cover;
                border-radius: 8px;
                border: 2px solid #e9ecef;
            }
            
            .item-details {
                font-weight: 600;
                color: #333;
                margin-bottom: 5px;
            }
            
            .item-color {
                font-size: 12px;
                color: #666;
                background-color: #e9ecef;
                padding: 2px 8px;
                border-radius: 12px;
                display: inline-block;
            }
            
            .price {
                font-weight: 600;
                color: #28a745;
                font-size: 16px;
            }
            
            .quantity {
                background-color: #667eea;
                color: white;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
            }
            
            .address-section {
                background-color: #f8f9fa;
                border-radius: 12px;
                padding: 25px;
                margin-bottom: 30px;
            }
            
            .address-details {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            
            .address-line {
                margin-bottom: 8px;
                color: #333;
            }
            
            .total-section {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 25px;
                border-radius: 12px;
                text-align: center;
                margin-bottom: 30px;
            }
            
            .total-amount {
                font-size: 32px;
                font-weight: 700;
                margin-bottom: 10px;
            }
            
            .total-label {
                font-size: 16px;
                opacity: 0.9;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .footer {
                background-color: #343a40;
                color: white;
                padding: 30px;
                text-align: center;
            }
            
            .footer p {
                margin-bottom: 10px;
                opacity: 0.8;
            }
            
            .action-required {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 30px;
            }
            
            .action-required h3 {
                color: #856404;
                margin-bottom: 10px;
                font-size: 18px;
            }
            
            .action-required p {
                color: #856404;
                margin-bottom: 0;
            }
            
            @media (max-width: 600px) {
                .container {
                    margin: 0;
                    box-shadow: none;
                }
                
                .content {
                    padding: 20px;
                }
                
                .order-info {
                    grid-template-columns: 1fr;
                }
                
                .items-table {
                    font-size: 14px;
                }
                
                .items-table th,
                .items-table td {
                    padding: 10px;
                }
                
                .total-amount {
                    font-size: 24px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 New Order Received!</h1>
                <p>Order #${orderId} • ${formateDateString(orderDate)}</p>
            </div>
            
            <div class="content">
                <div class="action-required">
                    <h3>⚡ Action Required</h3>
                    <p>A new order has been placed and requires your attention. Please review the details below and prepare the products for shipment.</p>
                </div>
                
                <div class="order-summary">
                    <h2 class="section-title">📋 Order Summary</h2>
                    <div class="order-info">
                        <div class="info-item">
                            <div class="info-label">Order ID</div>
                            <div class="info-value">#${orderId}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Order Date</div>
                            <div class="info-value">${formateDateString(orderDate)}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Payment Status</div>
                            <div class="info-value">
                                <span class="status-badge ${paymentStatus ? "status-paid" : "status-pending"}">
                                    ${paymentStatus ? "✅ Paid" : "⏳ Pending"}
                                </span>
                            </div>
                        </div>
                        ${
                          paymentMethod
                            ? `
                        <div class="info-item">
                            <div class="info-label">Payment Method</div>
                            <div class="info-value">${paymentMethod}</div>
                        </div>
                        `
                            : ""
                        }
                    </div>
                </div>
                
                <h2 class="section-title">👤 Customer Information</h2>
                <div class="order-summary">
                    <div class="order-info">
                        <div class="info-item">
                            <div class="info-label">Name</div>
                            <div class="info-value">${customerName}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Email</div>
                            <div class="info-value">${customerEmail}</div>
                        </div>
                        ${
                          customerPhone
                            ? `
                        <div class="info-item">
                            <div class="info-label">Phone</div>
                            <div class="info-value">${customerPhone}</div>
                        </div>
                        `
                            : ""
                        }
                    </div>
                </div>
                
                <h2 class="section-title">📦 Order Items</h2>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Details</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderItems
                          .map(
                            (item) => `
                            <tr>
                                <td>
                                    <img src="${item.imageUrl}" alt="${item.title}" class="item-image" onerror="this.style.display='none'">
                                </td>
                                <td>
                                    <div class="item-details">${item.title}</div>
                                    ${item.color ? `<span class="item-color">Color: ${item.color}</span>` : ""}
                                    ${item.isCustomProduct ? '<span class="item-color">Custom Product</span>' : ""}
                                </td>
                                <td>
                                    <span class="quantity">${item.quantity}</span>
                                </td>
                                <td>
                                    <span class="price">${formatCurrency(item.offerPrice)}</span>
                                </td>
                                <td>
                                    <span class="price">${formatCurrency(item.offerPrice * item.quantity)}</span>
                                </td>
                            </tr>
                        `,
                          )
                          .join("")}
                    </tbody>
                </table>
                
                <div class="total-section">
                    <div class="total-amount">${formatCurrency(totalAmount)}</div>
                    <div class="total-label">Total Order Value</div>
                </div>
                
                <h2 class="section-title">🚚 Shipping Address</h2>
                <div class="address-section">
                    <div class="address-details">
                        <div class="address-line"><strong>${shippingAddress.name}</strong></div>
                        <div class="address-line">📞 ${shippingAddress.phone}</div>
                        ${shippingAddress.alternate_phone ? `<div class="address-line">📞 ${shippingAddress.alternate_phone} (Alt)</div>` : ""}
                        <div class="address-line">📍 ${shippingAddress.address}</div>
                        <div class="address-line">${shippingAddress.locality}</div>
                        <div class="address-line">${shippingAddress.district}, ${shippingAddress.state}</div>
                        <div class="address-line">PIN: ${shippingAddress.pincode}</div>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>SGTMAKE Admin Panel</strong></p>
                <p>This is an automated notification. Please log in to your admin panel to manage this order.</p>
                <p>© ${new Date().getFullYear()} SGTMAKE. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `
}

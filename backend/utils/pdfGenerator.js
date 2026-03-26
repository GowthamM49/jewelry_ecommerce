import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate invoice PDF for an order
 */
export const generateInvoicePDF = (order, user) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const filename = `invoice-${order.orderNumber}.pdf`;
      const filepath = path.join(__dirname, '../invoices', filename);
      
      // Ensure invoices directory exists
      const invoicesDir = path.dirname(filepath);
      if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
      }
      
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // Header
      doc.fontSize(20).text('JEWELRY INVOICE', { align: 'center' });
      doc.moveDown();
      
      // Company details
      doc.fontSize(10)
        .text('Sudha Jewelry', { align: 'left' })
        .text('Premium Gold & Diamond Jewelry', { align: 'left' })
        .text('Email: info@sudhajewelry.com', { align: 'left' })
        .text('Phone: +91-XXXXXXXXXX', { align: 'left' });
      
      doc.moveDown();
      
      // Invoice details
      doc.fontSize(12)
        .text(`Invoice Number: ${order.orderNumber}`, { align: 'right' })
        .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, { align: 'right' });
      
      doc.moveDown();
      
      // Customer details
      doc.fontSize(12).text('Bill To:', { underline: true });
      doc.fontSize(10)
        .text(user.name)
        .text(user.email);
      
      if (order.shippingAddress) {
        doc.text(order.shippingAddress.street || '')
          .text(`${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''}`)
          .text(`Phone: ${order.shippingAddress.phone || ''}`);
      }
      
      doc.moveDown();
      
      // Items table header
      const tableTop = doc.y;
      doc.fontSize(10)
        .text('Item', 50, tableTop)
        .text('Qty', 200, tableTop)
        .text('Weight', 250, tableTop)
        .text('Rate', 320, tableTop)
        .text('Amount', 400, tableTop, { width: 100, align: 'right' });
      
      // Items
      let y = tableTop + 20;
      order.items.forEach((item, index) => {
        if (y > 700) {
          doc.addPage();
          y = 50;
        }
        
        doc.fontSize(9)
          .text(item.name || 'Product', 50, y, { width: 150 })
          .text(item.quantity.toString(), 200, y)
          .text(`${item.weight}g`, 250, y)
          .text(`₹${item.unitPrice?.toFixed(2) || '0.00'}`, 320, y)
          .text(`₹${item.totalPrice?.toFixed(2) || '0.00'}`, 400, y, { width: 100, align: 'right' });
        
        y += 15;
      });
      
      // Totals
      y += 10;
      doc.fontSize(10)
        .text(`Subtotal: ₹${order.subtotal.toFixed(2)}`, 400, y, { width: 100, align: 'right' })
        .text(`GST (3%): ₹${order.gst.toFixed(2)}`, 400, y + 15, { width: 100, align: 'right' })
        .fontSize(12)
        .text(`Total: ₹${order.total.toFixed(2)}`, 400, y + 35, { width: 100, align: 'right' });
      
      doc.moveDown(3);
      
      // Footer
      doc.fontSize(8)
        .text('Thank you for your purchase!', { align: 'center' })
        .text('This is a computer-generated invoice.', { align: 'center' });
      
      doc.end();

      stream.on('finish', () => {
        resolve({ filepath, filename });
      });
      
      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate sales report PDF
 */
export const generateSalesReportPDF = (orders, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const filename = `sales-report-${startDate}-${endDate}.pdf`;
      const filepath = path.join(__dirname, '../reports', filename);
      
      // Ensure reports directory exists
      const reportsDir = path.dirname(filepath);
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }
      
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // Header
      doc.fontSize(20).text('SALES REPORT', { align: 'center' });
      doc.moveDown();
      
      // Report details
      doc.fontSize(12)
        .text(`Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`, { align: 'center' })
        .text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
      
      doc.moveDown();
      
      // Summary statistics
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const totalItems = orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
      
      doc.fontSize(14).text('Summary:', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10)
        .text(`Total Orders: ${totalOrders}`)
        .text(`Total Revenue: ₹${totalRevenue.toLocaleString()}`)
        .text(`Total Items Sold: ${totalItems}`)
        .text(`Average Order Value: ₹${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00'}`);
      
      doc.moveDown();
      
      // Orders table header
      const tableTop = doc.y;
      doc.fontSize(10)
        .text('Order #', 50, tableTop)
        .text('Date', 120, tableTop)
        .text('Customer', 200, tableTop)
        .text('Items', 320, tableTop)
        .text('Total', 400, tableTop, { width: 100, align: 'right' });
      
      // Orders
      let y = tableTop + 20;
      orders.forEach((order, index) => {
        if (y > 700) {
          doc.addPage();
          y = 50;
        }
        
        doc.fontSize(9)
          .text(order.orderNumber, 50, y, { width: 70 })
          .text(new Date(order.createdAt).toLocaleDateString(), 120, y, { width: 80 })
          .text(order.user?.name || 'N/A', 200, y, { width: 120 })
          .text(order.items.length.toString(), 320, y, { width: 30 })
          .text(`₹${order.total?.toLocaleString()}`, 400, y, { width: 100, align: 'right' });
        
        y += 15;
      });
      
      doc.moveDown(2);
      
      // Footer
      doc.fontSize(8)
        .text('This is a computer-generated report.', { align: 'center' });
      
      doc.end();
      
      stream.on('finish', () => {
        resolve({ filepath, filename });
      });
      
      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate inventory report PDF
 */
export const generateInventoryReportPDF = (products) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const filename = `inventory-report-${new Date().toISOString().split('T')[0]}.pdf`;
      const filepath = path.join(__dirname, '../reports', filename);
      
      // Ensure reports directory exists
      const reportsDir = path.dirname(filepath);
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }
      
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // Header
      doc.fontSize(20).text('INVENTORY REPORT', { align: 'center' });
      doc.moveDown();
      
      // Report details
      doc.fontSize(12)
        .text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
      
      doc.moveDown();
      
      // Summary statistics
      const totalProducts = products.length;
      const totalValue = products.reduce((sum, product) => sum + (product.price || 0), 0);
      const lowStock = products.filter(p => p.stock < 10).length;
      
      doc.fontSize(14).text('Summary:', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10)
        .text(`Total Products: ${totalProducts}`)
        .text(`Total Inventory Value: ₹${totalValue.toLocaleString()}`)
        .text(`Low Stock Items (< 10): ${lowStock}`);
      
      doc.moveDown();
      
      // Products table header
      const tableTop = doc.y;
      doc.fontSize(10)
        .text('Product Name', 50, tableTop)
        .text('Category', 200, tableTop)
        .text('Stock', 300, tableTop)
        .text('Price', 350, tableTop, { width: 80, align: 'right' })
        .text('Value', 430, tableTop, { width: 80, align: 'right' });
      
      // Products
      let y = tableTop + 20;
      products.forEach((product, index) => {
        if (y > 700) {
          doc.addPage();
          y = 50;
        }
        
        const value = (product.price || 0) * (product.stock || 0);
        
        doc.fontSize(9)
          .text(product.name, 50, y, { width: 150 })
          .text(product.category, 200, y, { width: 100 })
          .text(product.stock?.toString() || '0', 300, y, { width: 50 })
          .text(`₹${product.price?.toLocaleString() || '0'}`, 350, y, { width: 80, align: 'right' })
          .text(`₹${value.toLocaleString()}`, 430, y, { width: 80, align: 'right' });
        
        y += 15;
      });
      
      doc.moveDown(2);
      
      // Footer
      doc.fontSize(8)
        .text('This is a computer-generated report.', { align: 'center' });
      
      doc.end();
      
      stream.on('finish', () => {
        resolve({ filepath, filename });
      });
      
      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate user report PDF
 */
export const generateUserReportPDF = (users) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const filename = `user-report-${new Date().toISOString().split('T')[0]}.pdf`;
      const filepath = path.join(__dirname, '../reports', filename);
      
      // Ensure reports directory exists
      const reportsDir = path.dirname(filepath);
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }
      
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // Header
      doc.fontSize(20).text('USER REPORT', { align: 'center' });
      doc.moveDown();
      
      // Report details
      doc.fontSize(12)
        .text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
      
      doc.moveDown();
      
      // Summary statistics
      const totalUsers = users.length;
      const activeUsers = users.filter(u => u.isActive !== false).length;
      const adminUsers = users.filter(u => u.role === 'admin').length;
      const staffUsers = users.filter(u => u.role === 'staff').length;
      const customerUsers = users.filter(u => u.role === 'customer').length;
      
      doc.fontSize(14).text('Summary:', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10)
        .text(`Total Users: ${totalUsers}`)
        .text(`Active Users: ${activeUsers}`)
        .text(`Admin Users: ${adminUsers}`)
        .text(`Staff Users: ${staffUsers}`)
        .text(`Customer Users: ${customerUsers}`);
      
      doc.moveDown();
      
      // Users table header
      const tableTop = doc.y;
      doc.fontSize(10)
        .text('Name', 50, tableTop)
        .text('Email', 150, tableTop)
        .text('Role', 300, tableTop)
        .text('Status', 350, tableTop)
        .text('Joined', 400, tableTop);
      
      // Users
      let y = tableTop + 20;
      users.forEach((user, index) => {
        if (y > 700) {
          doc.addPage();
          y = 50;
        }
        
        doc.fontSize(9)
          .text(user.name, 50, y, { width: 100 })
          .text(user.email, 150, y, { width: 150 })
          .text(user.role, 300, y, { width: 50 })
          .text(user.isActive !== false ? 'Active' : 'Inactive', 350, y, { width: 50 })
          .text(new Date(user.createdAt).toLocaleDateString(), 400, y, { width: 80 });
        
        y += 15;
      });
      
      doc.moveDown(2);
      
      // Footer
      doc.fontSize(8)
        .text('This is a computer-generated report.', { align: 'center' });
      
      doc.end();
      
      stream.on('finish', () => {
        resolve({ filepath, filename });
      });
      
      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};


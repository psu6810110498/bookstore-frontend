import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Row, Col, Card, Statistic } from 'antd';

const URL_BOOK = "/api/book";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function DashboardScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(URL_BOOK);
        setData(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) return <div>Loading...</div>;

  const categoryCount = data.reduce((acc, book) => {
    const catName = book.category ? book.category.name : 'Unknown';
    acc[catName] = (acc[catName] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(categoryCount).map(key => ({
    name: key,
    value: categoryCount[key]
  }));

  const stockData = data.map(book => ({
    name: book.title.length > 10 ? book.title.substring(0, 10) + '...' : book.title,
    stock: book.stock,
    price: book.price
  }));

  const totalStock = data.reduce((sum, book) => sum + book.stock, 0);
  const totalValue = data.reduce((sum, book) => sum + (book.price * book.stock), 0);

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={16} marginBottom={20}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Books" value={data.length} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Total Stock" value={totalStock} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Total Value" value={totalValue} prefix="$" precision={2} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={12}>
           <Card title="Books per Category">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
           </Card>
        </Col>
        <Col span={12}>
          <Card title="Stock Levels">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={stockData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="stock" fill="#82ca9d" name="Stock" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs } from 'antd';
import ProductManagement from './components/ProductManagement';
import OrderManagement from './components/OrderManagement';
import Dashboard from './components/Dashboard';
import { getProducts, saveProducts } from './utils/data';

const { TabPane } = Tabs;

const OrderProductManagement: React.FC = () => {
	const [refreshKey, setRefreshKey] = useState(0);
	const [products, setProducts] = useState<any[]>([]);

	useEffect(() => {
		setProducts(getProducts());
	}, []);

	const handleOrderChange = () => {
		setRefreshKey((prevKey) => prevKey + 1);
	};

	const handleProductChange = (newProducts: any[]) => {
		setProducts(newProducts);
		saveProducts(newProducts);
		// Also refresh the dashboard
		setRefreshKey((prevKey) => prevKey + 1);
	};

	const handleTabChange = (key: string) => {
		if (key === 'products') {
			setProducts(getProducts()); // Re-fetch products to ensure latest data
		}
	};

	return (
		<PageContainer>
			<Dashboard refreshKey={refreshKey} />
			<Tabs defaultActiveKey='products' destroyInactiveTabPane={false} onChange={handleTabChange}>
				<TabPane tab='Product Management' key='products'>
					<ProductManagement products={products} onProductChange={handleProductChange} />
				</TabPane>
				<TabPane tab='Order Management' key='orders'>
					<OrderManagement
						products={products}
						onProductChange={handleProductChange}
						onOrderChange={handleOrderChange}
					/>
				</TabPane>
			</Tabs>
		</PageContainer>
	);
};

export default OrderProductManagement;

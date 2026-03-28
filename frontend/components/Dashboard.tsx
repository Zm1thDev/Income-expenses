import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { FiPieChart } from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend);

interface Dashboard {
  summary: { income: number; expense: number; balance: number };
  transactions: any[];
}

export default function DashboardChart({ summary, transactions }: Dashboard) {
  const expenseCategories = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: Record<string, number>, current) => {
      const catName = current.category?.name || 'อื่นๆ';
      acc[catName] = (acc[catName] || 0) + Number(current.amount);
      return acc;
    }, {});

  const DonutsLabels = Object.keys(expenseCategories);
  const DonutsData = Object.values(expenseCategories);

  const BarChartData = {
    labels: ['ภาพรวมบัญชีทั้งหมด'],
    datasets: [
      {
        label: 'รายรับ',
        data: [summary.income],
        backgroundColor: 'rgba(16, 185, 129, 0.85)',
        borderRadius: 0,
      },
      {
        label: 'รายจ่าย',
        data: [summary.expense],
        backgroundColor: 'rgba(239, 68, 68, 0.85)',
        borderRadius: 0,
      },
      {
        label: 'คงเหลือ',
        data: [summary.balance],
        backgroundColor: 'rgba(59, 130, 246, 0.85)',
        borderRadius: 0,
      },
    ],
  };

  const DonutsChartData = {
    labels: DonutsLabels,
    datasets: [{
      data: DonutsData,
      backgroundColor: ['#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#10B981', '#6366F1'],
      borderWidth: 0,
    }],
  };

  const monthNames = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const monthlyExpenses = Array(12).fill(0);
  const currentYear = new Date().getFullYear();

  transactions.forEach(t => {
    const d = new Date(t.transactionDate);
    if (d.getFullYear() === currentYear && t.type === 'expense') {
      monthlyExpenses[d.getMonth()] += Number(t.amount);
    }
  });

  const MonthlyChartData = {
    labels: monthNames,
    datasets: [
      {
        label: `รายจ่ายปี ${currentYear}`,
        data: monthlyExpenses,
        borderColor: '#8B5CF6',
        backgroundColor: '#8B5CF6',
        tension: 0.3,
        borderWidth: 3,
        pointBackgroundColor: '#8B5CF6',
      }
    ]
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
          <FiPieChart size={20} />
        </div>
        <h3 className="font-bold text-gray-800">แดชบอร์ด</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-[2rem] bg-gray-50 flex flex-col justify-center">
          {/* bar chart */}
          <h3 className="font-bold text-gray-800 text-center mb-6">เปรียบเทียบรายรับ-รายจ่าย</h3>
          <div className="h-64 flex items-center justify-center flex-1 w-full">
            <Bar
              data={BarChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } },
                scales: { y: { beginAtZero: true } }
              }}
            />
          </div>
        </div>

        <div className="p-6 rounded-[2rem] bg-gray-50 flex flex-col items-center justify-center">
          {/* donut chart */}
          <h3 className="font-bold text-gray-800 text-center mb-6">สัดส่วนรายจ่าย</h3>
          <div className="h-64 flex items-center justify-center w-full">
            {DonutsData.length > 0 ? (
              <Doughnut
                data={DonutsChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } },
                  cutout: '60%'
                }}
              />
            ) : (
              <div className="text-gray-400 font-medium text-sm">ยังไม่มีข้อมูลรายจ่าย</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-6 rounded-[2rem] bg-gray-50 flex flex-col justify-center">
        {/* line chart */}
        <h3 className="font-bold text-gray-800 text-center mb-6">รายจ่ายแต่ละเดือน (ปี {currentYear})</h3>
        <div className="h-72 flex items-center justify-center flex-1 w-full">
          <Line
            data={MonthlyChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } },
              scales: { y: { beginAtZero: true } }
            }}
          />
        </div>
      </div>
    </>
  );
}

import Card from "../../../../components/card";
import React from "react";

const General = () => {
    return (
        <Card extra={"w-full h-full p-3"}>
            {/* Header */}
            <div className="mt-2 mb-8 w-full">
                <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
                    Genel Bilgiler
                </h4>
                <p className="mt-2 px-2 text-base text-gray-600">
                    Bir şirket, karekod ve POS sistemleri ile iş yönetimi pratiklerini entegre ederek operasyonel
                    verimliliği ve müşteri memnuniyetini artırabilir. Karekodlar envanter takibini kolaylaştırır ve
                    israfı azaltırken, POS sistemleri satış süreçlerini hızlandırır ve değerli müşteri verileri sağlar.
                    Bu teknolojilerin akıllıca kullanımı, daha etkili stok yönetimi ve talebe dayalı satış stratejileri
                    geliştirmeye yardımcı olur, böylece hem maliyetleri düşürür hem de karlılığı artırır.
                </p>
            </div>
            <div className="grid grid-cols-2 gap-4 px-2">
                <div
                    className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                    <p className="text-sm text-gray-600">Education</p>
                    <p className="text-base font-medium text-navy-700 dark:text-white">
                        Stanford University
                    </p>
                </div>

                <div
                    className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                    <p className="text-sm text-gray-600">Languages</p>
                    <p className="text-base font-medium text-navy-700 dark:text-white">
                        English, Spanish, Italian
                    </p>
                </div>

                <div
                    className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="text-base font-medium text-navy-700 dark:text-white">
                        Product Design
                    </p>
                </div>

                <div
                    className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                    <p className="text-sm text-gray-600">Work History</p>
                    <p className="text-base font-medium text-navy-700 dark:text-white">
                        English, Spanish, Italian
                    </p>
                </div>

                <div
                    className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                    <p className="text-sm text-gray-600">Organization</p>
                    <p className="text-base font-medium text-navy-700 dark:text-white">
                        Simmmple Web LLC
                    </p>
                </div>

                <div
                    className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                    <p className="text-sm text-gray-600">Birthday</p>
                    <p className="text-base font-medium text-navy-700 dark:text-white">
                        20 July 1986
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default General;

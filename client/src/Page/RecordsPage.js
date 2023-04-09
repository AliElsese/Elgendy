import React from "react";

const RecordsPage = () => {
  return (
    <div className="records-content">
      <div className="container">
        <div className="records-wrapper">
          <div className="d-flex justify-content-between align-items-center ">
            <div className="text-center">
              <h5>شركة يحيى شلبى</h5>
              <p>للتجارة وتوزيع المواد الغذائية</p>
              <p>فرع كفر الدوار</p>
            </div>
            <div>
              <h5>رقم الفاتورة :</h5>
              <div className="i-num">6</div>
            </div>
            <div>
              <h6>رقم التسجيل الضريبى : 35-669-407</h6>
              <h6>
                العنوان : <span>دسونس-ابو حمص-دمنهور</span>
              </h6>
            </div>
          </div>
          <h6 className="mt-5 mb-2">
            التاريخ : <span>31/01/2023</span>
          </h6>
          <div className="d-flex align-items-center">
            <h6 className="mb-0 w-20">المطلوب من السادة :</h6>
            <p className="name">عبد الكريم</p>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center w-75">
              <h6 className="mb-0 "> العنوان :</h6>
              <p style={{ paddingRight: "25%" }}>كفر الدوار</p>
            </div>
            <div className="d-flex align-items-center w-25">
              <h6 className="mb-0 "> رقم التسجيل :</h6>
              <p>123456789</p>
            </div>
          </div>
          <table class="table my-5">
            <thead>
              <tr>
                <th scope="col">كود الصنف</th>
                <th scope="col">البيان</th>
                <th scope="col">الوحدة</th>
                <th scope="col">سعر الوحدة</th>
                <th scope="col">الكمية</th>
                <th scope="col">الخصم</th>
                <th scope="col">الضريبة</th>
                <th scope="col">الاجمالى</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>96610</td>
                <td>تايجر طمام 5 جنيه 12 كيس</td>
                <td>CAR</td>
                <td>48.25</td>
                <td>34.2</td>
                <td>6</td>
                <td>43.1</td>
                <td>255.25</td>
              </tr>
              <tr>
                <td>96610</td>
                <td>تايجر طمام 5 جنيه 12 كيس</td>
                <td>CAR</td>
                <td>48.25</td>
                <td>34.2</td>
                <td>6</td>
                <td>43.1</td>
                <td>255.25</td>
              </tr>
              <tr>
                <td>96610</td>
                <td>تايجر طمام 5 جنيه 12 كيس</td>
                <td>CAR</td>
                <td>48.25</td>
                <td>34.2</td>
                <td>6</td>
                <td>43.1</td>
                <td>255.25</td>
              </tr>
              <tr>
                <td>96610</td>
                <td>تايجر طمام 5 جنيه 12 كيس</td>
                <td>CAR</td>
                <td>48.25</td>
                <td>34.2</td>
                <td>6</td>
                <td>43.1</td>
                <td>255.25</td>
              </tr>

              <tr>
                <td colspan="3" className="text-end">
                  العنوان : منشأه الحبشى
                </td>
                <td colspan="2">اجمالى الفاتورة</td>
                <td></td>
                <td></td>
                <td>8.7562</td>
              </tr>
              <tr>
                <td colspan="3" className="text-end not-font">
                  البضاعة المباعة بحالة جيده والشركة غير مسئولة عن سوء النخزين
                </td>
                <td colspan="2"> قيمة الخصم</td>
                <td></td>
                <td></td>
                <td>8.7562</td>
              </tr>
              <tr>
                <td colspan="3" className="text-end not-font">
                  اسم المندوب :
                </td>
                <td colspan="2">ضريبة المبيعات 14%</td>
                <td></td>
                <td></td>
                <td>8.7562</td>
              </tr>
              <tr>
                <td colspan="3" className="text-end no-border"></td>
                <td colspan="4">الاجمالى شامل الضريبة</td>

                <td>8.7562</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecordsPage;

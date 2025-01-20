import InputField from "../../components/fields/InputField";
import {useMutation} from "react-query";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {loginSuccess} from "../../store/AuthSlice";
import useAuth from "hooks/useAuth";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import {useFormik} from "formik";
import * as Yup from 'yup';
import {useState} from "react";
import PhotoUpload from "../../components/PhotoUpload";
import {toast} from "react-toastify";


export default function NewCompany() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useAuth()
    const axiosPrivate = useAxiosPrivate()

    const [fileData, setFileData] = useState();

    const createCompany = async (companyData) => {
        const response = await axiosPrivate.post('/company', {...companyData, userId: auth.currentUser});
        return response.data;
    };

    const mutation =
        useMutation(values => createCompany(values),
            {
                onSuccess: (data) => {
                    /*console.log({user: auth.currentUser, logo: data.data.logo, company: data.data.companyId, access_token:auth.accessToken})*/
                    dispatch(loginSuccess({user: auth.currentUser, role: auth.currentUserRole, logo: data.data.logo, company: data.data.companyId, access_token:auth.accessToken, refresh_token: auth.refreshToken}));
                    toast("sirket olusturuldu")
                    navigate("/");
                }, onError: (error) => {
                    toast.error("sirket olustulurken hata oldu")
                    console.error(error);
                },
            });

    const formik = useFormik({
        initialValues: {
            name: '', email: '', phone: '', type: '', headCount: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Şirket Adı gerekli'),
            email: Yup.string().email('Geçersiz e-posta adresi').required('Email gereklidir'),
            phone: Yup.string(),
            type: Yup.string(),
            headCount: Yup.number().positive('headCount pozitif bir sayı olmalıdır'),
        }),
    });

    const handleFileDataChange = (newFileData) => {
        setFileData(newFileData);
    };

    const handleSubmit = (values) => {
        values.logo = fileData || "";
        mutation.mutate(values);
    }
    return (
        <div className="flex h-full w-full">

            <div className=" flex items-center justify-center w-full">
                <div className="flex h-full w-full items-center justify-center">
                    <div className="mt-[10vh] w-full max-w-full flex-col items-center">
                        <h4 className="text-4xl font-bold">
                            Yeni Bir Şirket Oluşturun
                        </h4>
                        <p className="mb-9 ml-1 text-base">
                            Yeni bir şirket oluşturmak için ayrıntıları girin.
                        </p>
                        <PhotoUpload onFileDataChange={handleFileDataChange} multiImage={false} priority={"upload"}/>
                        <form>
                            <InputField
                                name="name"
                                label="Firma Adı*"
                                type="text"
                                placeholder="Şirket adın"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && formik.errors.name}
                            />

                            <InputField
                                name="email"
                                label="İletişim E-posta*"
                                type="email"
                                placeholder="iletişim@şirket.com"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && formik.errors.email}
                            />
                            <InputField
                                name="phone"
                                label="Telefon numarası"
                                type="text"
                                placeholder="505-555-5555"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.phone && formik.errors.phone}
                            />
                            <InputField
                                name="type"
                                label="Endüstri"
                                type="text"
                                placeholder="Endüstri türü"
                                value={formik.values.type}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.type && formik.errors.type}
                            />
                            <InputField
                                name="headCount"
                                label="Çalışan Sayısı"
                                type="number"
                                placeholder="örneğin 50"
                                value={formik.values.headCount}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.headCount && formik.errors.headCount}
                            />

                            <button
                                type="button"
                                onClick={() => handleSubmit(formik.values)}
                                className={`mt-2 w-full rounded-xl py-[12px] text-base font-medium
                                ${mutation.isLoading ? 'bg-brand-300' : 'bg-brand-500 hover:bg-brand-600'} text-white`}
                                disabled={mutation.isLoading}
                            >
                                {mutation.isLoading ? 'Şirket Oluşturuluyor...' : 'Şirket Oluştur'}
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>);
}

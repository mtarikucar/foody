import Modal from '../../../../../components/modal';
import QR from "../../../../../components/QR";
import {useParams} from "react-router-dom";

function Index({isOpen, onClose}) {

    const  {id} =useParams();

    /*
    *  "!bilgi: aldiginiz pakete gore uradaki karekodlar degisebilmektedir paketler bakimindan bir degisiklik yaptikysaniz karekodlarinizi guncellemeniz gerekebilir.\n" +
                   "masaya gore degisiklik gosteren bir pakete sahipseniz masa sayisi kadar karekod elde etmeniz gerekmektedir. diger paketlerin hepsinde tum subede kullanabilecginiz sekilde tek bir akrekod elde etmeniz gerekmektedir.*/
    return (
        <Modal title={'sube-karekod'}
               description={"sistemde kullanacaginiz karedkodlar burada listelenmektedir.\n"}
               size="extraLarge" isOpen={isOpen}
               onClose={onClose}>

            <div className="flex justify-center items-center ">
                <div className={" "}>
                    <QR  qrValue={id} tableNumber={1} restaurantName={"Fatih"}  />
                    {/*{qrData.map((data, index) => (
                        <QR key={index} keyProp={index} link={data} />
                    ))}*/}
                </div>
            </div>

        </Modal>
    );
}

export default Index;

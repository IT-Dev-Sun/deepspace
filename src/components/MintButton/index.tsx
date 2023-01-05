import React, { useState, useEffect } from 'react';
import CustomModal from '../../components/Modal/CustomModal'
import NewMintModal from '../Modal/NewMintModal';
import { IoRocket } from 'react-icons/io5';
import { ToastContainer } from 'react-toastr';
import "toastr/build/toastr.css";
import "animate.css/animate.css";
import shipImage from '../../asset/image/build_ship.svg';
import { useActiveWeb3React } from '../../hooks';
import Image from 'next/image';
const MintButton = () => {
    const { account } = useActiveWeb3React();
    const [showMintModal, setShowMintModal] = useState(false);
    const [newMintModal, setNewMintModal] = useState(false);
    const [lockModal, setLockModal] = useState(false);
    const [listModal, setListModal] = useState(false);
    let container;
    const [c, setC] = useState(null)
    useEffect(() => {
        setC(container);
    }, [container])
    const showToastr = (status) => {
        if (c) {
            let msg_type = "mint a ship";
            if (status === 'accountDisconnect') c.error("Please connect wallet", "Error");
            if (status === 'aprroveReady') c.info("A one-time Approve request is required before getting started", "Message");
            if (status === 'approveSuccess') c.success(`Approve success. You can ${msg_type}. Please click confirm.`, 'Success');
            if (status === 'listPriceError') c.error("List price is not valid.", "Error");
            if (status === 'balanceNotEnough') c.error("Balance is not enough", "Error");
        }
    }
    const handleClick = (modalType) => {
        if (modalType === 'bridge-ship-in') setLockModal(true);
        else setListModal(true);
    }
    const openModal = (modalType) => {
        if (!account) {
            c.error("Please connect wallet");
        } else {
            if (modalType === 'mint-ship') {
                setShowMintModal(true);
            }
        }
    }

    return (
        <div className='flex justify-center mt-3 mb-3'>
            <ToastContainer ref={ref => container = ref} className="toast-top-right" style={{ zIndex: '100000' }} />
            <button type='button' className='flex items-center justify-center mint-button fire goldman-font' onClick={() => openModal('mint-ship')}><div className="flex items-center justify-center mint-button-image goldman-font"><span>BUILD SHIP&nbsp;&nbsp;&nbsp;&nbsp;</span> <Image src={shipImage} width='30px' height='30px' alt='' /></div></button>
            <CustomModal show={showMintModal} onClose={() => { setShowMintModal(false); }} shipCardType="mint-ship" onOpen={() => { setNewMintModal(true) }} showToastr={showToastr} />
            <NewMintModal show={newMintModal} onClose={() => { setNewMintModal(false) }} handleClick={handleClick} />
            <CustomModal show={lockModal} onClose={() => { setLockModal(false); }} shipCardType="bridge-ship-in" showToastr={showToastr} />
            <CustomModal show={listModal} onClose={() => { setListModal(false); }} shipCardType="list-ship" showToastr={showToastr} />
        </div>
    )
}
export default MintButton;
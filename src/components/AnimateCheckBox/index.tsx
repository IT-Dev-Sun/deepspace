import React from 'react';

export function AnimateCheckBox({ handleStatus, nftData }) {
    return (
        <div className="exp">
            <div className="checkbox">
                <form>
                    <div>
                        <input type="checkbox" id={`check_${nftData.tokenId}`} name="check" value="" checked={nftData.checked} onChange={() => { handleStatus(nftData.tokenId) }} />
                        <label htmlFor={`check_${nftData.tokenId}`}>
                            <span></span>
                        </label>
                    </div>
                </form>
            </div>
        </div>
    )
}
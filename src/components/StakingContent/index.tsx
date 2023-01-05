import React from 'react';

interface StakingContentProps {
    content: string
    value: string
    addtional_content?: string
}
const StakingContent: React.FC<StakingContentProps> = ({ content, value, addtional_content }) => {
    return (
        <div className="mt-10 pb-7 text-lg">
            <div>{content}</div>
            <div>{addtional_content ? addtional_content : ''}</div>
            <div className='mt-3'>{value}</div>
        </div>
    )
}

export default StakingContent;
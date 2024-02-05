import React from 'react';
import Avatar from './Avatar';
import Heading from './Heading';

const FriendCard = ({ friend }) => {
    const { full_name, avatar, phone } = friend;

    const cardStyle = {
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        borderBottom: '1px solid #ccc',
    };

    const phoneStyle = {
        color: '#666',
    };

    return (
        <div style={cardStyle}>
            <Avatar
                src={
                    'https://inkythuatso.com/uploads/thumbnails/800/2022/05/anh-meo-che-anh-meo-bua-15-31-09-19-00.jpg'
                }
            />
            <div>
                <div className="flex-1 border-bottom 1px-solid">
                    <Heading text={full_name} />
                </div>
                <p style={phoneStyle}>{phone}</p>
            </div>
        </div>
    );
};

export default FriendCard;

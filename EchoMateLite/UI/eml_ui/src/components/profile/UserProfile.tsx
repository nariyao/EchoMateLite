import React from 'react';
import style from './css/userProfile.module.css';
import { IUser } from './iProfile';

const UserProfile: React.FC<{ user: IUser }> = ({ user }) => {
    // Format full name, handling optional middle name
    const fullName = [
        user.first_name,
        user.middle_name,
        user.last_name
    ].filter(Boolean).join(' ');

    // Format address parts, filtering out empty lines
    const addressParts = [
        user.address.line1,
        user.address.line2,
        user.address.city,
        user.address.state,
        user.address.country
    ].filter(Boolean).join(', ')

    return (
        <article className={style.user_profile}>
            <div className={style.user_profile_image}>
                <img src={user.profileImage} alt={`${fullName}'s profile`} />
            </div>

            <div className={style.user_profile_details}>
                <header className={style.user_name}>
                    <h2>{fullName}</h2>
                    <span>Joined on {user.doj}</span>
                </header>

                <section className={style.user_contact}>
                    <span>
                        <i className="fa-solid fa-envelope" style={{ color: "#74C0FC" }}></i>
                        <span> {user.email}</span>
                    </span>
                    <span>
                        <i className="fa-solid fa-phone" style={{ color: "#74C0FC" }}></i>
                        <span> {user.phone}</span>
                    </span>
                </section>

                <section className={style.user_dob_doj}>
                    <span>DOB: {user.dob}</span>
                    <span>Gender: {user.gender}</span>
                </section>

                <address className={style.user_address}>
                    <i className="fa-solid fa-address-card" style={{ color: "#74C0FC" }}></i>
                    <span> {addressParts} </span>
                </address>
            </div>
        </article>
    );
};

export default UserProfile;

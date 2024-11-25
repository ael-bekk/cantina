import styles from '../../styles/HomePage.module.scss';
import cn from 'classnames';
import { FcAlarmClock } from "react-icons/fc";
import { useRouter } from 'next/router';


export default function HomePage({ data, identity }) {

    const router = useRouter();

    const sliceTime = (time) => {
        return time.slice(0, data.lunch.start.length - 3)
    }

    return (
        <main className={styles.homePage}>
            <section className={styles.header}>
                <h2>Welcome to </h2>
                <h1>1337 Restaurant</h1>
                <h2>{identity.identity}</h2>
                {/* <h2 className={styles.ramadanKarim}>
                    رمضان مبارك
                </h2> */}
            </section>
            <section className={styles.body}>
                <div className={styles.container}>
                    {data.breakfast &&
                        <div className={cn(styles.mealCard, !data.breakfast.is_active && styles.inactive)} onClick={() => { data.breakfast.is_active && router.push('/breakfast') }}>
                            <div className={styles.meta}>
                                <div className={styles.ar}>
                                    <span>الفطور</span>
                                    {/* <span>وجبات الإفطار الجاهزة</span> */}
                                </div>
                                <h3>Breakfast</h3>
                                <span className={styles.time}>
                                    <FcAlarmClock size={22} />
                                    <span>{sliceTime(data.breakfast.start)} to {sliceTime(data.breakfast.end)}</span>
                                </span>
                            </div>
                            <div className={styles.images}>
                                <img src="/3d/Coffee_Cup.png" alt="" />
                                {/* <img
                                    src="/ramadan/tamr.png"
                                    alt=""
                                    className={styles.donut}
                                /> */}
                                <img
                                    src="/3d/Donut.png"
                                    alt=""
                                    className={styles.donut}
                                />
                            </div>
                        </div>

                    }

                    {
                        data.lunch &&
                        <div className={cn(styles.mealCard, !data.lunch.is_active && styles.inactive)} onClick={() => { data.lunch.is_active && router.push('/lunch') }}>
                            <div className={styles.meta}>
                                <div className={styles.ar}>
                                    <span>الغداء</span>
                                    {/* <span>وجبة الإفطار</span> */}
                                </div>
                                <h3>Lunch</h3>
                                {/* <h3>Breakfast</h3> */}
                                <span className={styles.time}>
                                    <FcAlarmClock size={22} />
                                    <span>{sliceTime(data.lunch.start)} to {sliceTime(data.lunch.end)}</span>
                                </span>
                            </div>
                            <div className={styles.images}>
                                {/* <img src="/ramadan/barad.png" alt="" /> */}
                                <img src="/3d/Sandwich.png" alt="" />
                                <img src="/3d/Glass_Drink.png" alt="" />
                            </div>
                        </div>
                    }


                    {
                        data.dinner &&
                        <div className={cn(styles.mealCard, !data.dinner.is_active && styles.inactive)} onClick={() => { data.dinner.is_active && router.push('/dinner') }}>
                            <div className={styles.meta}>
                                <div className={styles.ar}>
                                    <span>العشاء</span>
                                    {/* <span>العشاء والسحور</span> */}
                                </div>
                                <h3>Dinner</h3>
                                <span className={styles.time}>
                                    <FcAlarmClock size={22} />
                                    <span>{sliceTime(data.dinner.start)} to {sliceTime(data.dinner.end)}</span>
                                </span>
                            </div>
                            <div className={styles.images}>
                                <img src="/3d/Burger_Final.png" alt="" />
                                <img src="/3d/Fries.png" alt="" />
                                {/* <img src="/ramadan/plate.png" alt="" /> */}
                            </div>
                        </div>
                    }
                    {/* {data.lunch && (
                        <div
                            className={cn(
                                styles.mealCard,
                                !data.lunch.is_active && styles.inactive
                            )}
                            style={{
                                height: "160px",
                                // overflow: "hidden",
                            }}
                            onClick={() => {
                                data.lunch.is_active && router.push("/lunch");
                            }}
                        >
                            <div className={styles.meta}>
                                <div className={styles.ar}>
                                    <span>إفطار رمضان</span>
                                </div>
                                <h3>Iftar Ramadan</h3>
                                <span className={styles.time}>
                                    <FcAlarmClock size={22} />
                                    <span>
                                        18:00 to 20:30 
                                    </span>
                                </span>
                            </div>
                            <div className={styles.images}>
                                <img
                                    src="/ramadan/tamr.png"
                                    alt=""
                                    style={{
                                        marginTop: "-50px",
                                    }}
                                />
                                <img
                                    src="/ramadan/barad.png"
                                    alt=""
                                    style={{
                                        width: "140px",
                                        top: "-50px",
                                    }}
                                />
                            </div>
                        </div>
                    )} */}

                    {/* {data.dinner && (
                        <div
                            className={cn(
                                styles.mealCard,
                                !data.dinner.is_active && styles.inactive
                            )}
                            onClick={() => {
                                data.dinner.is_active && router.push("/dinner");
                            }}
                        >
                            <div className={styles.meta}>
                                <div className={styles.ar}>
                                    <span>العشاء و السحور</span>
                                </div>
                                <h3>Dinner & Suhoor</h3>
                                <span className={styles.time}>
                                    <FcAlarmClock size={22} />
                                    <span>
                                        22:30 to 01:00
                                    </span>
                                </span>
                            </div>
                            <div className={styles.images}>
                                <img
                                    src="/ramadan/plate.png"
                                    alt=""
                                    style={{
                                        marginTop: "-50px",
                                    }}
                                />
                                <img
                                    src="/ramadan/briwat.png"
                                    alt=""
                                    style={{
                                        width: "140px",
                                        // top: "-5px",
                                    }}
                                />
                            </div>
                        </div>
                    )} */}
                </div>
            </section>
        </main>
    )
}

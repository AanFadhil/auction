import { useEffect, useState } from "react";
import formatDuration from 'date-fns/formatDuration'
import intervalToDuration from 'date-fns/intervalToDuration'
import differenceInSeconds from 'date-fns/differenceInSeconds';
import { toDate } from '../../utilities/dateUtil';

const getCountDown = (endTime) => {
    let now = new Date()
    let endDate = toDate(endTime)

    let duration = intervalToDuration({
        start: now,
        end: endDate,
    })

    let secondDiff = differenceInSeconds(endDate, now)

    if(secondDiff < 0){
        duration.years = 0
        duration.months = 0
        duration.days = 0
        duration.hours = 0
        duration.minutes = 0
        duration.seconds = 0
    }

    return {
        duration,
        secondDiff
    }
}

const CountDown = ({ end, alertInMinutes = 60 }) => {



    const [countdown, setSeconds] = useState(getCountDown(end));

    useEffect(() => {
        let interval = setInterval(() => {
            setSeconds(getCountDown(end));
            if (countdown.secondDiff <= 0) {
                clearInterval(interval);
            }
        }, 1000);


        return () => clearInterval(interval);
    }, [end]);

    const colorClass = (countdown.secondDiff/60) < alertInMinutes ? 'text-red-700':'text-blue-600'
    return (
        <div className={["inline font-semibold",colorClass].join(' ')}>
            {countdown.duration.years > 0 ? <span className="mr-2">{countdown.duration.years} {countdown.duration.years > 1 ? 'years' : 'year'}</span> : null}
            {countdown.duration.months > 0 ? <span className="mr-2">{countdown.duration.months} {countdown.duration.months > 1 ? 'months' : 'month'}</span> : null}
            {countdown.duration.days > 0 ? <span className="mr-2">{countdown.duration.days} {countdown.duration.days > 1 ? 'days' : 'day'}</span> : null}
            <span>{countdown.duration.hours.toString().padStart(2,'0')}:</span>
            <span>{countdown.duration.minutes.toString().padStart(2,'0')}:</span>
            <span>{countdown.duration.seconds.toString().padStart(2,'0')}</span>
        </div>
    );

}

export default CountDown
import dayjs from 'dayjs';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
//although we have type:module these above 2 lines helps us use imports as require ESM 

import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js';

const REMINDERS = [7, 5, 3, 1]; //get reminders based on days ---> (7 days etc)

const { serve } = require('@upstash/workflow/express')

export const sendReminders = serve( async(context) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if(!subscription || subscription.status != 'active' ) return; //if not active easy...just return no work

    //returns current sate and time of subs
    const renewalDate = dayjs(subscription.renewalDate);
    if(renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflfow.`);
        return;
    }

    for(const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');
        if(reminderDate.isAfter(dayjs())) {
            await sleepUntilRemainder(context, `Reminder ${daysBefore} days before`, reminderDate);
        }

        if(dayjs().isSame(reminderDate, 'day')) {
            //this must be exactly the format in emailtemplate.js
            await triggerRemainder(context, `${daysBefore} days before reminder`, subscription);
        }
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    })
};      

const sleepUntilRemainder = async (context, label, date) => {
    console.log(`Sleeping Until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
};


///this is important
const triggerRemainder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);
        
        await sendReminderEmail({
            to: subscription.user.email, //whoever created that email/ user
            type: label, //select what day reminder 7,5,3,1
            subscription,
        });
    })
}




///need to wrap this only controller instead of (req, res) with serve()

//WHY THIS FILE?:
        //Send reminders to users before their subscription renewal.
        //Use Upstash Workflow to run logic on schedule or via triggers (instead of manual routes).
        //Rely on Day.js for easy date math.
        //Integrate with MongoDB using Mongoose models.
        //Plan for reminder scheduling logic (though actual sending is not yet implemented).







        
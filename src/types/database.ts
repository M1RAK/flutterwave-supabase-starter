export interface User {
	id: string
	email: string
	full_name?: string
	created_at: string
	updated_at: string
}

export interface Subscription {
	id: string
	user_id?: string
	customer_email: string
	flutterwave_transaction_id: string
	flutterwave_plan_id: string
	flutterwave_customer_id?: string
	flutterwave_subscription_id?: string
	status: 'pending' | 'active' | 'cancelled' | 'expired' | 'failed'
	current_period_start?: string
	current_period_end?: string
	cancel_at_period_end: boolean
	cancelled_at?: string
	created_at: string
	updated_at: string
}

export interface FlutterwavePlan {
	id: number
	name: string
	amount: number
	interval: string
	duration: number
	status: string
	currency: string
	plan_token: string
}

export interface FlutterwaveTransaction {
	id: number
	tx_ref: string
	amount: number
	currency: string
	status: string
	created_at: string
	customer: {
		email: string
		name: string
	}
	meta?: {
		__CheckoutInitAddress: string
		__FingerprintConfidenceScore: string
		userId: string
		user_email: string
		plan_id: string
	}
}

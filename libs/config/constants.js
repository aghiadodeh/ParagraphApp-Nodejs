const Constants = {
    get platforms() {
        return {
            web: 'web',
            ios: 'ios',
            android: 'andoid'
        }
    },
    get roles() {
        return {
            user: 'user',
            admin: 'admin',
        }
    },
    get perPage() {
        return 10
    },
    get userSelect() {
        return { password: 0, firebaseTokens: 0, createdAt: 0, updatedAt: 0, role: 0 }
    },
    get paragraphSelect() {
        return { comments: 0, seenBy: 0, rates: 0 }
    },
}
export default Constants;
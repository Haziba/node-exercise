module.exports = {
    success: data => {
        return {
            success: true,
            data: data
        }
    },

    failure: error => {
        return {
            success: false,
            error: error
        }
    }
}

export default {
  methods: {
    $_log(data) {
      console.log(data)
      return Promise.resolve(data)
    },
    $_mUtil_toastError(error) {
      if (error instanceof Error) {
        // error from frontend
        this.$toast(error.message)
      } else if (error.errcode) {
        // error from backend
        this.$toast(error.description)
      } else if (error.code === 'ECONNABORTED') {
        this.$toast('请求超时，请重试!')
      } else {
        this.$toast(JSON.stringify(error))
      }
    }
  }
}

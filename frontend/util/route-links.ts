export const links = {
  home: '/',
  login: '/user/auth/login',
  register: '/user/auth/register',
  openShop: '/shop/open',
  sellProduct: '/product/sell',
  cart: '/cart',
  checkout: '/cart/checkout',
  shopDetail: (slug: string) => {
    return '/shop/' + slug
  },
  productDetail: (productID: string) => {
    return '/product/' + productID
  },
  editProduct: (productID: string) => {
    return '/product/' + productID + '/edit'
  },
  editProfile: '/user/edit',
  editShop: '/shop/edit',
  search: (query: string = '') => {
    return '/search' + query
  },
  transaction: '/transaction',
  transactionDetail: (transactionID: string) => {
    return '/transaction/' + transactionID
  },
  manageUsers: '/user/admin/manage',
  dashboard: '/user/admin/dashboard',
  wishlist: '/cart/wishlist',
  about: '/about',
  terms: '/terms',
  chat: '/chat',
  reksadana: '/reksadana',
}

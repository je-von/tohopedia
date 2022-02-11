export const links = {
  home: '/',
  login: '/user/auth/login',
  register: '/user/auth/register',
  openShop: '/shop/open',
  sellProduct: '/product/sell',
  cart: '/cart',
  shopDetail: (slug: string) => {
    return '/shop/' + slug
  },
  productDetail: (productID: string) => {
    return '/product/' + productID
  },
  editProfile: '/user/edit',
  editShop: '/shop/edit',
}

export const links = {
  home: '/',
  login: '/auth/login',
  register: '/auth/register',
  openShop: '/shop/open',
  shopDetail: (slug: string) => {
    return '/shop/' + slug
  },
  productDetail: (productID: string) => {
    return '/product/' + productID
  },
}

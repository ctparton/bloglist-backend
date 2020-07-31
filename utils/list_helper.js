const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogList) => {
  return blogList.reduce((currentSum, i) => currentSum + i.likes, 0)
}

const favouriteBlog = (blogList) => {
  const totalLikes = blogList.reduce((currentMax, i) => {
    currentMax < i.likes ? currentMax = i.likes : currentMax
    return currentMax
  }, 0)
  return blogList.find(blog => blog.likes === totalLikes)
}
  module.exports = {
    dummy, 
    totalLikes, 
    favouriteBlog
  }
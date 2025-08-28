import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();
  
  // 🔥 status=0 是作者，status=1 是普通用户
  const isAuthor = user?.status === 0;
  
  const permissions = {
    // 文章相关权限
    canCreateArticle: isAuthor,
    canEditArticle: (articleAuthor) => {
      if (!user || !isAuthor) return false;
      return user.username === articleAuthor;
    },
    canDeleteArticle: (articleAuthor) => {
      if (!user || !isAuthor) return false;
      return user.username === articleAuthor;
    },
    
    // 页面访问权限
    canAccessMyArticles: isAuthor,
    canAccessCreatePage: isAuthor,
    
    // 角色判断
    isAuthor: isAuthor,
    isLoggedIn: !!user
  };
  
  return permissions;
};
from rest_framework.permissions import BasePermission, SAFE_METHODS


class NotAuthenticated(BasePermission):
    def has_permission(self, request, view):
        return not request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return not request.user.is_authenticated


class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return bool(request.method in SAFE_METHODS)

    def has_object_permission(self, request, view, obj):
        return bool(request.method in SAFE_METHODS or obj.user == request.user)


class IsOwnerOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return bool(request.user == obj.user or request.method in SAFE_METHODS)

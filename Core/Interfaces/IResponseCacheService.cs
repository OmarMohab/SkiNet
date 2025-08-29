using System;

namespace Core.Interfaces;

public interface IResponseCacheService
{
    Task CacheResponseAsync(string cacheKey, object response, TimeSpan timeToLive);
    Task<string?> GetCachedResonseAsync(string cacheKey);
    Task RemoveCacheByPattern(string pattern);
}

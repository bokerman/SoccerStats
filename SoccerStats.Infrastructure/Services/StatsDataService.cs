using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Json;

public class StatsDataService : IStatsDataService
{
    private HttpClient _httpClient;
    private readonly IMemoryCache _cache;

    private Dictionary<int, string> Leagues = new Dictionary<int, string>()
    {
        {2017, "Primeira Liga (Portugal)" },
        {2021, "Premier League (England)" },
        {2003, "Eredivisie (Netherlands)" },
        {2002, "Bundesliga (Germany)" },
        {2019, "Serie A (Italy)" },
        {2014, "La Liga (Spain)" },
        {2032, "Serie A (Brazil)" }
    };
    public StatsDataService(HttpClient httpClient, IConfiguration configuration, IMemoryCache memoryCache)
    {
        _cache = memoryCache;
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri(configuration["FootballDataOrg:Uri"]);
        _httpClient.DefaultRequestHeaders.Add("X-Auth-Token", configuration["FootballDataOrg:ApiKey"]);
    }

    // TODO: Fetch on load and cache these results
    public async Task<List<LeagueGameCollectionDto>> GetUpcomingMatchesAsync(TimeSpan cacheDuration)
    {
        const string cacheKey = "UpcomingMatches";

        if (_cache.TryGetValue(cacheKey, out List<LeagueGameCollectionDto> cachedMatches))
            return cachedMatches;

        var response = await _httpClient.GetFromJsonAsync<RootObject>(
            string.Concat(
                "v4/matches?",
                $"competitions={string.Join(",", Leagues.Keys)}",
                $"&status=SCHEDULED",
                $"&dateTo={DateTime.Now.AddDays(7):yyyy-MM-dd}",
                $"&dateFrom={DateTime.Now:yyyy-MM-dd}")
            ) ?? new RootObject();

        var upcomingMatches = response.MapToDto(Leagues);
        _cache.Set(cacheKey, upcomingMatches, cacheDuration);

        return upcomingMatches;
    }

    public async Task<List<LeagueGameCollectionDto>> GetRecentMatchesAsync()
    {
        var response = await _httpClient.GetFromJsonAsync<RootObject>(
          string.Concat(
             "v4/matches?",
             $"competitions={string.Join(",", Leagues.Keys)}",
             "&status=FINISHED",
             $"&dateFrom={DateTime.Now.AddDays(-3):yyyy-MM-dd}",
             $"&dateTo={DateTime.Now.AddDays(1):yyyy-MM-dd}")
     ) ?? new RootObject();

        return response.MapToDto(Leagues);
    }

    
    

    
}

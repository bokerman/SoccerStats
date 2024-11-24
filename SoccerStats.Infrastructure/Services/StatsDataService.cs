using Microsoft.Extensions.Configuration;
using SoccerStats.Infrastructure;
using System.Diagnostics;
using System.Drawing;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Runtime.CompilerServices;
using System.Runtime.Intrinsics.X86;
using System.Text.Json;
using System.Text.RegularExpressions;

public class StatsDataService : IStatsDataService
{
    private HttpClient _httpClient;

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
    public StatsDataService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri(configuration["FootballDataOrg:Uri"]);
        _httpClient.DefaultRequestHeaders.Add("X-Auth-Token", configuration["FootballDataOrg:ApiKey"]);
    }

    // TODO: Fetch on load and cache these results
    public async Task<List<LeagueGameCollectionDto>> GetUpcomingMatchesAsync()
    {
        var response = await _httpClient.GetFromJsonAsync<RootObject>(
            string.Concat(
                "v4/matches?",
                $"competitions={string.Join(",", Leagues.Keys)}",
                $"&status=SCHEDULED", 
                $"&dateTo={DateTime.Now.AddDays(7).ToString("yyyy-MM-dd")}",
                $"&dateFrom={DateTime.Now.ToString("yyyy-MM-dd")}")
            ) ?? new RootObject();
              
        return response.MapToDto(Leagues);
    }

    public async Task<List<LeagueGameCollectionDto>> GetRecentMatchesAsync()
    {
        var response = await _httpClient.GetFromJsonAsync<RootObject>(
             string.Concat(
                "v4/matches?",
                $"competitions={string.Join(",", Leagues.Keys)}",
                "&status=FINISHED",
                $"&dateFrom={DateTime.Now.AddDays(-3).ToString("yyyy-MM-dd")}",
                $"&dateTo={DateTime.Now.AddDays(1).ToString("yyyy-MM-dd")}")
        ) ?? new RootObject();

        return response.MapToDto(Leagues);
    }

    
    

    
}

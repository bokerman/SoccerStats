public interface IStatsDataService
{
    Task<List<LeagueGameCollectionDto>> GetRecentMatchesAsync();
    Task<List<LeagueGameCollectionDto>> GetUpcomingMatchesAsync(TimeSpan cacheDuration);
}

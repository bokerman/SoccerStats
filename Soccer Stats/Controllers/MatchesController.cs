using Microsoft.AspNetCore.Mvc;

public class MatchesController : Controller
{
    private readonly IStatsDataService _statsDataService;

    public MatchesController(IStatsDataService statsService)
    {
        _statsDataService = statsService;
    }

    public async Task<IActionResult> Upcoming()
    {
        var matches = await _statsDataService.GetUpcomingMatchesAsync(TimeSpan.FromMinutes(1));
        return Json(matches);
    }

    public async Task<IActionResult> Recent()
    {
        var matches = await _statsDataService.GetRecentMatchesAsync();
        return Json(matches);
    }
}
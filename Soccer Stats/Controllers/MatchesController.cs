using Microsoft.AspNetCore.Mvc;

public class MatchesController : Controller
{
    private readonly IStatsDataService _statsDataService;

    public MatchesController(IStatsDataService statsService)
    {
        _statsDataService = statsService;
    }

    public async Task<IActionResult> Index()
    {
        var matches = await _statsDataService.GetUpcomingMatchesAsync();
        return Json(matches);
    }
}
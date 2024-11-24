using System;
public class SoccerOddsGenerator
{
    private static readonly Random random = new Random();

    public static (decimal HomeWin, decimal Draw, decimal AwayWin) GenerateOdds()
    {
        // Generate base odds for each outcome
        decimal homeWin = GenerateRandomDecimal(1.2m, 3.5m);
        decimal draw = GenerateRandomDecimal(2.5m, 4.0m);
        decimal awayWin = GenerateRandomDecimal(2.0m, 5.0m);

        // Normalize odds to ensure realistic distribution if needed
        decimal total = homeWin + draw + awayWin;
        homeWin = Math.Round(homeWin / total * 9, 2);
        draw = Math.Round(draw / total * 9, 2);
        awayWin = Math.Round(awayWin / total * 9, 2);

        return (homeWin, draw, awayWin);
    }

    private static decimal GenerateRandomDecimal(decimal min, decimal max)
    {
        double range = (double)(max - min);
        double value = random.NextDouble() * range + (double)min;
        return Math.Round((decimal)value, 2);
    }
}

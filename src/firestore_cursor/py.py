import requests
from bs4 import BeautifulSoup

def decode_and_print_grid(doc_url: str):
    response = requests.get(doc_url)
    response.raise_for_status()
    
    soup = BeautifulSoup(response.text, "html.parser")
    
    # Extract all rows from the table
    rows = soup.find_all("tr")
    
    points = []

    for row in rows[1:]:  # skip the header row
        cols = row.find_all("td")
        if len(cols) != 3:
            continue
        try:
            x = int(cols[0].get_text(strip=True))
            char = cols[1].get_text(strip=True)
            y = int(cols[2].get_text(strip=True))
            points.append((x, y, char))
        except ValueError:
            continue  # skip malformed rows

    if not points:
        print("No valid data points found.")
        return

    # Determine grid bounds
    min_x = min(p[0] for p in points)
    max_x = max(p[0] for p in points)
    min_y = min(p[1] for p in points)
    max_y = max(p[1] for p in points)

    width = max_x - min_x + 1
    height = max_y - min_y + 1

    # Initialize the grid
    grid = [[' ' for _ in range(width)] for _ in range(height)]

    for x, y, ch in points:
        gx = x - min_x
        gy = y - min_y
        grid[gy][gx] = ch

    # Print the grid
    for row in grid:
        print("".join(row))

# Example call
if __name__ == "__main__":
    url = "https://docs.google.com/document/d/e/2PACX-1vRPzbNQcx5UriHSbZ-9vmsTow_R6RRe7eyAU60xIF9Dlz-vaHiHNO2TKgDi7jy4ZpTpNqM7EvEcfr_p/pub"
    decode_and_print_grid(url)

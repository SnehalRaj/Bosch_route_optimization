# Bosch_route_optimization

Code for winning submission of Bosch's Route Optimization Algorithm at Inter-IIT Techmeet 8.0


## Algorithm

Our algorithm is based on botton up approach , that is , we will first solve smaller problems , and then we will use their solution to solve bigger problems. We will first represent how our algorithm will work , what do we exactly mean by smaller problems , and how we will be using their solution to solve bigger problems , while optimising our solution as far as possible.

#### Goal: The optimised way to travel/cover i ( < N) cities.

We will be finding optimised path for covering i+1 cities using solution of i cities.Note that these i cities will be a subset of N cities , i.e. we will be freely choosing any i cities out of these N . The only constraint that we will be varying is the exact number of cities.

So we will be finding solition of covering i number of cities such that the path end at city 1 , city 2 , city 3 .. and so on ..

Path[i][j] will be a vector storing i number of cities ( which are covered) , such that j is the starting point of the path.
We optimise total distance that we need to travel to cover any i cities such that the path ends at city j.

The base case is i = 1 , i.e. , we need to travel exactly 1 city .
The solution to this problem is trivial. For each j , we need to travel only 1 city , such that the path ends at city j . Ofcourse , only city j will be visited , and the lath will be an edge between centre and city j .

So , path[ 1 ][ j ] will contain only j as its element

Let us also maintain a 2-D array which will store the total distance that we need to travel to cover i cities such that path ends at city j . Let us call this array dist[i][j] .
So for our base case ( i = 1) , dist[1][j] will be equal to the distance between centre and city j
